export const THEME_COLOR = '#1d2e54'; // 主题色

// hash 算法
export const HASH_ARITHMETIC_LIST = [
  {
    label: 'MD5',
    value: 'MD5',
  },
  {
    label: 'SHA1',
    value: 'SHA1',
  },
  {
    label: 'SHA256',
    value: 'SHA256',
  },
  {
    label: 'SHA512',
    value: 'SHA512',
  },
  {
    label: 'HmacMD5',
    value: 'HmacMD5',
  },
  {
    label: 'HmacSHA1',
    value: 'HmacSHA1',
  },
  {
    label: 'HmacSHA256',
    value: 'HmacSHA256',
  },
  {
    label: 'HmacSHA512',
    value: 'HmacSHA512',
  },
];

// 对称加密算法
export const SYMMETRIC_ENCRYPTION_ARITHMETRIC_LIST = [
  {
    label: 'AES',
    value: 'AES',
  },
  {
    label: 'DES',
    value: 'DES',
  },
  {
    label: '3DES',
    value: '3DES',
  },
  {
    label: 'RC4',
    value: 'RC4',
  },
];

// 输出编码格式
export const OUTPUT_ENCODING_LIST = [
  {
    label: 'base64',
    value: 'base64',
  },
  {
    label: 'hex',
    value: 'hex',
  },
];

export const AES_BLOCK_LIST = [
  {
    label: '128位',
    value: 128,
  },
  {
    label: '192位',
    value: 192,
  },
  {
    label: '256位',
    value: 256,
  },
];

// url 参数
export const URL_PARAMS = [
  {
    key: 'protocol',
    description: '协议',
  },
  {
    key: 'username',
    description: '用户名',
  },
  {
    key: 'password',
    description: '密码',
  },
  {
    key: 'hostname',
    description: '主机',
  },
  {
    key: 'port',
    description: '端口',
  },
  {
    key: 'pathname',
    description: '路径',
  },
  {
    key: 'hash',
    description: '哈希',
  },
  {
    key: 'searchParams',
    description: '搜索参数',
  },
];

export const URL_PARAMS_KEYS = URL_PARAMS.map((v) => v.key);
