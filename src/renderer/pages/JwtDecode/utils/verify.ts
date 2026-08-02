import { ECDSA_CURVE_MAP, HMAC_HASH_MAP, RSA_HASH_MAP } from '../constants';
import { IJwtParts, IVerifyResult } from '../types';
import { toBase64 } from './decode';

interface IVerifyParams {
  alg: string;
  parts: IJwtParts;
  secret?: string;
  publicKeyPem?: string;
}

const enc = new TextEncoder();

/** PEM 公钥 → DER 字节数组 */
const pemToDer = (pem: string): Uint8Array => {
  const cleaned = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\s+/g, '');
  if (!cleaned) throw new Error('公钥 PEM 内容为空');
  try {
    const binary = window.atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    throw new Error('公钥 PEM 无法解码,请确认是有效的 base64');
  }
};

/**
 * DER 编码的 ECDSA 签名 → raw r||s(P1363 格式)
 * DER: 30 <len> 02 <lenR> <r> 02 <lenS> <s>
 * r/s 可能带前置 0x00(高位为 1 时),需去除后按曲线字节长右对齐补齐
 */
const derToRaw = (der: Uint8Array, size: number): Uint8Array => {
  if (der[0] !== 0x30) throw new Error('非 DER 编码的 ECDSA 签名');
  let offset = 2;
  const readLen = (): number => {
    let len = der[offset++];
    if (len & 0x80) {
      const count = len & 0x7f;
      len = 0;
      for (let i = 0; i < count; i++) len = (len << 8) | der[offset++];
    }
    return len;
  };
  // r
  if (der[offset++] !== 0x02) throw new Error('DER 结构错误(期望 INTEGER)');
  const rLen = readLen();
  const rStart = offset;
  const rRaw = der.subarray(rStart, rStart + rLen);
  // 去掉 r 前置的 0x00(符号位填充)
  let rTrimStart = 0;
  while (rTrimStart < rRaw.length - 1 && rRaw[rTrimStart] === 0) rTrimStart++;
  const rTrimmed = rRaw.subarray(rTrimStart);
  if (rTrimmed.length > size) throw new Error('r 长度超出曲线大小');
  const r = new Uint8Array(size);
  r.set(rTrimmed, size - rTrimmed.length);
  offset += rLen;
  // s
  if (der[offset++] !== 0x02) throw new Error('DER 结构错误(期望 INTEGER)');
  const sLen = readLen();
  const sStart = offset;
  const sRaw = der.subarray(sStart, sStart + sLen);
  let sTrimStart = 0;
  while (sTrimStart < sRaw.length - 1 && sRaw[sTrimStart] === 0) sTrimStart++;
  const sTrimmed = sRaw.subarray(sTrimStart);
  if (sTrimmed.length > size) throw new Error('s 长度超出曲线大小');
  const s = new Uint8Array(size);
  s.set(sTrimmed, size - sTrimmed.length);

  const raw = new Uint8Array(size * 2);
  raw.set(r, 0);
  raw.set(s, size);
  return raw;
};

/**
 * 校验 JWT 签名(WebCrypto,渲染进程内完成)
 * signingInput = headerB64 + '.' + payloadB64(原始 base64url 文本)
 */
export const verifySignature = async ({ alg, parts, secret, publicKeyPem }: IVerifyParams): Promise<IVerifyResult> => {
  const signingInput = `${parts.headerB64}.${parts.payloadB64}`;
  const signatureBytes = new Uint8Array(
    (() => {
      const binary = window.atob(toBase64(parts.signatureB64));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    })(),
  );

  try {
    // ---- HMAC(HS256/384/512) ----
    if (HMAC_HASH_MAP[alg]) {
      if (!secret) return { valid: false, error: '请输入 HMAC 密钥(secret)' };
      const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: 'HMAC', hash: HMAC_HASH_MAP[alg] },
        false,
        ['verify'],
      );
      const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, enc.encode(signingInput));
      return valid ? { valid: true } : { valid: false, error: '签名不匹配:密钥错误或 token 被篡改' };
    }

    // ---- RSA(RS256/384/512) ----
    if (RSA_HASH_MAP[alg]) {
      if (!publicKeyPem) return { valid: false, error: '请输入公钥 PEM' };
      let der: Uint8Array;
      try {
        der = pemToDer(publicKeyPem);
      } catch (e: any) {
        return { valid: false, error: e.message };
      }
      let key: CryptoKey;
      try {
        key = await crypto.subtle.importKey(
          'spki',
          der.buffer,
          { name: 'RSASSA-PKCS1-v1_5', hash: RSA_HASH_MAP[alg] },
          false,
          ['verify'],
        );
      } catch {
        return { valid: false, error: '公钥无法解析,请确认是有效的 RSA 公钥' };
      }
      const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signatureBytes, enc.encode(signingInput));
      return valid ? { valid: true } : { valid: false, error: '签名不匹配:公钥错误或 token 被篡改' };
    }

    // ---- ECDSA(ES256/384/512) ----
    if (ECDSA_CURVE_MAP[alg]) {
      if (!publicKeyPem) return { valid: false, error: '请输入公钥 PEM' };
      const { hash, namedCurve } = ECDSA_CURVE_MAP[alg];
      let der: Uint8Array;
      try {
        der = pemToDer(publicKeyPem);
      } catch (e: any) {
        return { valid: false, error: e.message };
      }
      let key: CryptoKey;
      try {
        key = await crypto.subtle.importKey('spki', der.buffer, { name: 'ECDSA', namedCurve }, false, ['verify']);
      } catch {
        return { valid: false, error: '公钥无法解析,请确认是有效的 ECDSA 公钥' };
      }

      const size = { 'P-256': 32, 'P-384': 48, 'P-521': 66 }[namedCurve]!;
      // JWT(ES*)签名通常是 raw r||s(P1363);部分库输出 DER,做一次转换兜底
      const candidates = [signatureBytes];
      if (signatureBytes[0] === 0x30) {
        try {
          candidates.push(derToRaw(signatureBytes, size));
        } catch {
          /* 忽略非 DER 情况 */
        }
      }
      for (const candidate of candidates) {
        const valid = await crypto.subtle.verify({ name: 'ECDSA', hash }, key, candidate, enc.encode(signingInput));
        if (valid) return { valid: true };
      }
      return { valid: false, error: '签名不匹配:公钥错误或 token 被篡改' };
    }

    return { valid: false, error: `不支持的算法: ${alg}` };
  } catch (e: any) {
    return { valid: false, error: e?.message || '校验过程发生异常' };
  }
};

/** 供页面展示签名字节(hex) */
export const bytesToHex = (bytes: number[]): string => bytes.map((b) => b.toString(16).padStart(2, '0')).join(' ');
