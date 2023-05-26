import crypto, { BinaryToTextEncoding } from 'crypto';
import CryptoJS from 'crypto-js';

import { TAlgorithm } from '../../common/contants/crypto';
import { Base64ToHex, hexToBase64 } from '../utils';

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
  padding: typeof CryptoJS.pad;
  key: string;
  iv: string;
  format: string;
}

export function encrypt(options: ICipherOptions) {
  const { algorithm, content, iv, key, padding, format, mode } = options;
  let ciphertext = '';
  if (algorithm === 'AES') {
    ciphertext = CryptoJS.AES.encrypt(content, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      // @ts-ignore
      mode: CryptoJS.mode[mode],
      // @ts-ignore
      padding: CryptoJS.pad[padding],
      format: CryptoJS.format.Hex,
    } as any).toString();
  }
  if (algorithm === 'DES') {
    ciphertext = CryptoJS.DES.encrypt(content, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      // @ts-ignore
      mode: CryptoJS.mode[mode],
      // @ts-ignore
      padding: CryptoJS.pad[padding],
      format: CryptoJS.format.Hex,
    } as any).toString();
  }

  if (algorithm === '3DES') {
    ciphertext = CryptoJS.TripleDES.encrypt(content, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      // @ts-ignore
      mode: CryptoJS.mode[mode],
      // @ts-ignore
      padding: CryptoJS.pad[padding],
      format: CryptoJS.format.Hex,
    } as any).toString();
  }
  if (algorithm === 'RC4') {
    ciphertext = CryptoJS.RC4.encrypt(content, CryptoJS.enc.Utf8.parse(key), {
      format: CryptoJS.format.Hex,
    }).toString();
  }
  if (format === 'base64') {
    return hexToBase64(ciphertext);
  }
  return ciphertext;
}

export function decrypt(options: ICipherOptions) {
  let { algorithm, content, iv, key, padding, format, mode } = options;
  let ciphertext = '';
  if (format === 'base64') {
    content = Base64ToHex(content);
  }
  if (algorithm === 'AES') {
    ciphertext = CryptoJS.AES.decrypt(content, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      // @ts-ignore
      mode: CryptoJS.mode[mode],
      // @ts-ignore
      padding: CryptoJS.pad[padding],
      format: CryptoJS.format.Hex,
    } as any).toString(CryptoJS.enc.Utf8);
  }
  if (algorithm === 'DES') {
    ciphertext = CryptoJS.DES.decrypt(content, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      // @ts-ignore
      mode: CryptoJS.mode[mode],
      // @ts-ignore
      padding: CryptoJS.pad[padding],
      format: CryptoJS.format.Hex,
    } as any).toString(CryptoJS.enc.Utf8);
  }

  if (algorithm === '3DES') {
    ciphertext = CryptoJS.TripleDES.decrypt(content, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      // @ts-ignore
      mode: CryptoJS.mode[mode],
      // @ts-ignore
      padding: CryptoJS.pad[padding],
      format: CryptoJS.format.Hex,
    } as any).toString(CryptoJS.enc.Utf8);
  }
  if (algorithm === 'RC4') {
    ciphertext = CryptoJS.RC4.decrypt(content, CryptoJS.enc.Utf8.parse(key), {
      format: CryptoJS.format.Hex,
    }).toString(CryptoJS.enc.Utf8);
  }
  return ciphertext;
}
