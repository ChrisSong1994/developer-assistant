// 输出编码格式
export const OUTPUT_ENCODING_OPTIONS = [
  {
    label: 'hex',
    value: 'hex',
  },
  {
    label: 'base64',
    value: 'base64',
  },
];

export const ENCRYPTION_ALGORITHM_OPTIONS = [
  {
    value: 'AES',
    label: 'AES',
  },
  {
    value: 'DES',
    label: 'DES',
  },
  {
    value: '3DES',
    label: '3DES',
  },
  {
    value: 'RC4',
    label: 'RC4',
  },
];

export const ENCRYPTION_MODE_OPTIONS = [
  {
    value: 'CBC',
    label: 'CBC',
  },
  {
    value: 'ECB',
    label: 'ECB',
  },
  {
    value: 'CFB',
    label: 'CFB',
  },
  {
    value: 'CTR',
    label: 'CTR',
  },
  {
    value: 'OFB',
    label: 'OFB',
  },
];

export const ENCRYPTION_PADDING_OPTIONS = [
  {
    label: 'ZeroPadding',
    value: 'ZeroPadding',
  },
  {
    label: 'Pkcs7Padding',
    value: 'Pkcs7',
  },
  {
    label: 'AnsiX923Padding',
    value: 'AnsiX923',
  },
  {
    label: 'Iso10126Padding',
    value: 'Iso10126',
  },
  {
    label: 'Iso97971Padding',
    value: 'Iso97971',
  },
  {
    label: 'NoPadding',
    value: 'NoPadding',
  },
];

export type TAlgorithm = 'AES' | 'DES' | '3DES' | 'RC4';
