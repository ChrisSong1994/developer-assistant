import crypto, { BinaryToTextEncoding } from 'crypto';
import CryptoJS from 'crypto-js';
import { TAlgorithm } from '../../common/contants/crypto';

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

export interface ICipherOptions {
  algorithm: TAlgorithm;
  content: string;
  mode: typeof CryptoJS.mode;
  key: string;
  iv: string;
  format: string;
}

export function encrypt(options: ICipherOptions) {
  const { algorithm } = options;
  if (algorithm.startsWith('AES')) {
    return encryptAES(options);
  }
  return '';
}

/**
 *  对称加密
 * */
export function encryptAES({ key, iv, content, format }: ICipherOptions) {
  var ciphertext = CryptoJS.AES.encrypt(content, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    format: CryptoJS.format.Hex,
  });

  return ciphertext.toString();
}
