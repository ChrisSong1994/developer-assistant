import crypto, { BinaryToTextEncoding } from 'node:crypto';

enum EHash {
  MD5 = 'md5',
  SHA1 = 'sha1',
  SHA256 = 'sha256',
  SHA512 = 'sha512',
}

interface IHashOptions {
  hash: EHash;
  content: string;
  digest: BinaryToTextEncoding;
}

/**
 * 生成hash
 * @param {object}
 * */
export function createHash({ hash, content, digest = 'hex' }: IHashOptions) {
  const res = crypto.createHash(hash).update(content).digest(digest);
  return res;
}
