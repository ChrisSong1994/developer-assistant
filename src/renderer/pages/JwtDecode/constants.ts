/** 示例 token:HS256,密钥为 your-256-bit-secret,含 sub/name/iat 字段 */
export const EXAMPLE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

/** 算法分组:用于决定校验区展示哪个密钥输入控件 */
export enum EAlgGroup {
  HMAC = 'HMAC',
  RSA = 'RSA',
  ECDSA = 'ECDSA',
  NONE = 'NONE',
  UNSUPPORTED = 'UNSUPPORTED',
}

/** 根据 JWT alg 判断算法分组 */
export const getAlgGroup = (alg: string): EAlgGroup => {
  if (/^HS\d{3}$/.test(alg)) return EAlgGroup.HMAC;
  if (/^RS\d{3}$/.test(alg)) return EAlgGroup.RSA;
  if (/^ES\d{3}$/.test(alg)) return EAlgGroup.ECDSA;
  if (alg === 'none') return EAlgGroup.NONE;
  return EAlgGroup.UNSUPPORTED;
};

/** HMAC 算法:alg → WebCrypto hash 名 */
export const HMAC_HASH_MAP: Record<string, string> = {
  HS256: 'SHA-256',
  HS384: 'SHA-384',
  HS512: 'SHA-512',
};

/** RSA 算法:alg → WebCrypto hash 名 */
export const RSA_HASH_MAP: Record<string, string> = {
  RS256: 'SHA-256',
  RS384: 'SHA-384',
  RS512: 'SHA-512',
};

/** ECDSA 算法:alg → { hash, namedCurve } */
export const ECDSA_CURVE_MAP: Record<string, { hash: string; namedCurve: string }> = {
  ES256: { hash: 'SHA-256', namedCurve: 'P-256' },
  ES384: { hash: 'SHA-384', namedCurve: 'P-384' },
  ES512: { hash: 'SHA-512', namedCurve: 'P-521' },
};
