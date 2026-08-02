/**
 * JWT 解码/校验逻辑验证脚本(开发用,不进生产构建)
 * 用真实 HS256/RS256/ES256 token 验证 utils 逻辑正确性。
 * 运行: node_modules/.bin/ts-node --transpile-only scripts/jwt-verify-test.ts
 */
import crypto from 'crypto';
import { execSync } from 'child_process';

// 模拟渲染进程的全局环境(Node 22 的全局 crypto 已是 WebCrypto)
globalThis.window = globalThis as any;

import { parseJwt } from '../src/renderer/pages/JwtDecode/utils/decode';
import { verifySignature } from '../src/renderer/pages/JwtDecode/utils/verify';

const b64url = (buf: Buffer) => buf.toString('base64url');
const enc = (s: string) => Buffer.from(s, 'utf-8');
const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error(`✗ FAIL: ${msg}`);
    process.exitCode = 1;
  } else {
    console.log(`✓ PASS: ${msg}`);
  }
};

async function testHS256() {
  const header = b64url(enc('{"alg":"HS256","typ":"JWT"}'));
  const payload = b64url(enc('{"sub":"1234567890","name":"John Doe","iat":1516239022}'));
  const secret = 'your-256-bit-secret';
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  const token = `${header}.${payload}.${sig}`;

  const decoded = parseJwt(token);
  assert(decoded.alg === 'HS256', 'parseJwt 识别 alg=HS256');
  assert(decoded.payload.name === 'John Doe', 'parseJwt 正确解析 payload');
  assert(decoded.claims.iat === 1516239022, 'parseJwt 提取 iat 时间戳');

  const ok = await verifySignature({ alg: 'HS256', parts: decoded.parts, secret });
  assert(ok.valid === true, 'HS256 正确 secret → 校验有效');

  const bad = await verifySignature({ alg: 'HS256', parts: decoded.parts, secret: 'wrong-secret-xx' });
  assert(bad.valid === false, 'HS256 错误 secret → 校验无效');
}

async function testRS256() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const publicPem = publicKey.export({ type: 'spki', format: 'pem' }) as string;
  const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;

  const header = b64url(enc('{"alg":"RS256","typ":"JWT"}'));
  const payload = b64url(enc('{"role":"admin","iat":1700000000}'));
  const signInput = `${header}.${payload}`;
  const sig = crypto.sign('sha256', enc(signInput), privatePem).toString('base64url');
  const token = `${header}.${payload}.${sig}`;

  const decoded = parseJwt(token);
  assert(decoded.alg === 'RS256', 'parseJwt 识别 alg=RS256');

  const ok = await verifySignature({ alg: 'RS256', parts: decoded.parts, publicKeyPem: publicPem });
  assert(ok.valid === true, 'RS256 正确公钥 → 校验有效');

  // 篡改公钥:改动 DER 中一个字节
  const tampered = publicPem.replace('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8B');
  const bad = await verifySignature({ alg: 'RS256', parts: decoded.parts, publicKeyPem: tampered });
  assert(bad.valid === false, 'RS256 篡改公钥 → 校验无效');
}

async function testES256() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const publicPem = publicKey.export({ type: 'spki', format: 'pem' }) as string;
  const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;

  const header = b64url(enc('{"alg":"ES256","typ":"JWT"}'));
  const payload = b64url(enc('{"sub":"es-test","iat":1700000000}'));
  const signInput = `${header}.${payload}`;
  // Node crypto.sign 输出 DER 编码 ECDSA 签名(带 0x30 前缀),正好测 DER 兜底路径
  const sig = crypto.sign('sha256', enc(signInput), privatePem).toString('base64url');
  const token = `${header}.${payload}.${sig}`;

  const decoded = parseJwt(token);
  assert(decoded.alg === 'ES256', 'parseJwt 识别 alg=ES256');

  const ok = await verifySignature({ alg: 'ES256', parts: decoded.parts, publicKeyPem: publicPem });
  assert(ok.valid === true, 'ES256(DER 签名,含兜底转换)正确公钥 → 校验有效');

  // 再测 raw r||s(P1363)格式:手动构造
  const derSig = crypto.sign('sha256', enc(signInput), privatePem);
  const raw = derToRaw(derSig, 32);
  const sigRaw = raw.toString('base64url');
  const tokenRaw = `${header}.${payload}.${sigRaw}`;
  const decodedRaw = parseJwt(tokenRaw);
  const okRaw = await verifySignature({ alg: 'ES256', parts: decodedRaw.parts, publicKeyPem: publicPem });
  assert(okRaw.valid === true, 'ES256(raw r||s 签名)正确公钥 → 校验有效');
}

/** 测试用:DER → raw r||s(P1363),去掉 r/s 前置 0x00 后右对齐 */
function derToRaw(der: Buffer, size: number): Buffer {
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
  offset++; // 0x02
  const rLen = readLen();
  let r = der.subarray(offset, offset + rLen);
  offset += rLen;
  offset++; // 0x02
  const sLen = readLen();
  let s = der.subarray(offset, offset + sLen);
  while (r.length > 1 && r[0] === 0) r = r.subarray(1);
  while (s.length > 1 && s[0] === 0) s = s.subarray(1);
  const rPadded = Buffer.alloc(size);
  r.copy(rPadded, size - r.length);
  const sPadded = Buffer.alloc(size);
  s.copy(sPadded, size - s.length);
  return Buffer.concat([rPadded, sPadded]);
}

function testUnicodePayload() {
  const header = b64url(enc('{"alg":"none"}'));
  const payload = b64url(enc('{"name":"张三","公司":"Developer Assistant"}'));
  const token = `${header}.${payload}.`;
  const decoded = parseJwt(token);
  assert(decoded.payload.name === '张三', 'Unicode payload 解码不乱码');
}

async function main() {
  await testHS256();
  await testRS256();
  await testES256();
  testUnicodePayload();

  // 非法 token
  try {
    parseJwt('not-a-jwt');
    console.error('✗ FAIL: 非法 token 未抛错');
    process.exitCode = 1;
  } catch (e: any) {
    console.log(`✓ PASS: 非法 token 抛错: ${e.message}`);
  }

  console.log(process.exitCode ? '\n部分用例失败' : '\n全部用例通过');
}

main();
