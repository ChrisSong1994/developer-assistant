/** JWT 三段原始(base64url 编码)部分 */
export interface IJwtParts {
  headerB64: string;
  payloadB64: string;
  signatureB64: string;
}

/** 解码结果 */
export interface IDecodedJwt {
  header: Record<string, any>;
  payload: Record<string, any>;
  signature: string;
  signatureBytes: number[];
  claims: IClaimTimestamps;
  alg: string;
  parts: IJwtParts;
}

/** 常见时间戳类 claim(秒级 Unix 时间戳) */
export interface IClaimTimestamps {
  exp?: number;
  iat?: number;
  nbf?: number;
}

/** 签名校验结果 */
export interface IVerifyResult {
  valid: boolean;
  error?: string;
}
