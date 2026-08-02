import { IDecodedJwt, IClaimTimestamps, IJwtParts } from '../types';

/** base64url 字符集 → 标准 base64 字符集,并补足 padding */
export const toBase64 = (input: string): string => {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  if (padding === 2) base64 += '==';
  else if (padding === 3) base64 += '=';
  return base64;
};

/** 把 base64url 字符串解码为字节数组(用于签名等二进制场景) */
export const base64UrlToBytes = (input: string): number[] => {
  const base64 = toBase64(input);
  // 浏览器自带 atob,支持标准 base64 → 二进制串
  const binary = window.atob(base64);
  const bytes = new Array<number>(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

/** 把 base64url 字符串解码为 UTF-8 文本 */
export const base64UrlDecode = (input: string): string => {
  const bytes = base64UrlToBytes(input);
  return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
};

/** 校验 JWT token 格式并切分为三段原始 base64url 部分 */
export const splitToken = (token: string): IJwtParts | null => {
  const trimmed = token.trim();
  if (!trimmed) return null;
  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    throw new Error('token 格式错误:需由 header.payload.signature 三段组成');
  }
  return {
    headerB64: parts[0],
    payloadB64: parts[1],
    signatureB64: parts[2],
  };
};

/** 提取 payload 中的时间戳类 claim(exp/iat/nbf) */
export const extractClaimTimestamps = (payload: Record<string, any>): IClaimTimestamps => {
  const claims: IClaimTimestamps = {};
  (['exp', 'iat', 'nbf'] as const).forEach((key) => {
    const value = payload[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      claims[key] = value;
    }
  });
  return claims;
};

/** 解析 JWT,失败抛带中文信息的错误 */
export const parseJwt = (token: string): IDecodedJwt => {
  const parts = splitToken(token);
  if (!parts) throw new Error('请输入 JWT token');

  let header: Record<string, any>;
  let payload: Record<string, any>;
  try {
    header = JSON.parse(base64UrlDecode(parts.headerB64));
  } catch {
    throw new Error('header 解析失败:base64 解码或 JSON 格式错误');
  }
  try {
    payload = JSON.parse(base64UrlDecode(parts.payloadB64));
  } catch {
    throw new Error('payload 解析失败:base64 解码或 JSON 格式错误');
  }

  const alg = typeof header?.alg === 'string' ? header.alg : '';

  return {
    header,
    payload,
    signature: parts.signatureB64,
    signatureBytes: base64UrlToBytes(parts.signatureB64),
    claims: extractClaimTimestamps(payload),
    alg,
    parts,
  };
};
