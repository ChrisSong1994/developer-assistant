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

export const ENCRYPTION_ALGORITHM_OPTIONS_MAP = {
  'AES-128-CBC': { requireIv: true, requirePadding: true, keySize: 16 },
  'AES-128-ECB': { requireIv: false, requirePadding: true, keySize: 16 },
  'AES-128-CFB': { requireIv: true, requirePadding: true, keySize: 16 },
  'AES-128-CTR': { requireIv: true, requirePadding: true, keySize: 16 },
  'AES-128-OFB': { requireIv: true, requirePadding: true, keySize: 16 },
  'AES-192-CBC': { requireIv: true, requirePadding: true, keySize: 24 },
  'AES-192-ECB': { requireIv: false, requirePadding: true, keySize: 24 },
  'AES-192-CFB': { requireIv: true, requirePadding: true, keySize: 24 },
  'AES-192-CTR': { requireIv: true, requirePadding: true, keySize: 24 },
  'AES-192-OFB': { requireIv: true, requirePadding: true, keySize: 24 },
  'AES-256-CBC': { requireIv: true, requirePadding: true, keySize: 32 },
  'AES-256-ECB': { requireIv: false, requirePadding: true, keySize: 32 },
  'AES-256-CFB': { requireIv: true, requirePadding: true, keySize: 32 },
  'AES-256-CTR': { requireIv: true, requirePadding: true, keySize: 32 },
  'AES-256-OFB': { requireIv: true, requirePadding: true, keySize: 32 },
};

export const ENCRYPTION_ALGORITHM_OPTIONS = Object.keys(ENCRYPTION_ALGORITHM_OPTIONS_MAP).map((key) => ({
  value: key,
  label: key,
}));

export const ENCRYPTION_PADDING_OPTIONS = [
  {
    label: 'Pkcs7',
    value: 'Pkcs7',
  },
  {
    label: 'AnsiX923',
    value: 'AnsiX923',
  },
  {
    label: 'Iso10126',
    value: 'Iso10126',
  },
  {
    label: 'Iso97971',
    value: 'Iso97971',
  },
  {
    label: 'ZeroPadding',
    value: 'ZeroPadding',
  },
  {
    label: 'NoPadding',
    value: 'NoPadding',
  },
];

export type TAlgorithm = keyof typeof ENCRYPTION_ALGORITHM_OPTIONS_MAP;
