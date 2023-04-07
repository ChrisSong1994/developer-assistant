import crypto, { BinaryToTextEncoding } from 'node:crypto';

export enum EHash {
  MD5 = 'MD5',
  SHA1 = 'SHA1',
  SHA256 = 'SHA256',
  SHA512 = 'SHA512',
  HmacMD5 = 'HmacMD5',
  HmacSHA1 = 'HmacSHA1',
  HmacSHA256 = 'HmacSHA256',
  HmacSHA512 = 'HmacSHA512',
}

export interface IHashOptions {
  hash: EHash;
  content: string;
  digest?: BinaryToTextEncoding;
  key?: string;
}

/**
 * 生成hash
 * @param {object}
 * */
export function createHash({ hash, content, key = '', digest = 'hex' }: IHashOptions) {
  if (hash.startsWith('Hmac')) {
    return crypto.createHmac(hash.slice(4), key).update(content).digest(digest);
  }
  return crypto.createHash(hash).update(content).digest(digest);
}

interface ICipherOptions {
  algorithm: string;
  block: number;
  key: string;
  iv: string;
  content: string;
  outputEncoding: string;
}

/**
 *  对称加密
 * */
export function encryptAES({ algorithm, key, iv, content, outputEncoding }: ICipherOptions) {}
