export enum EWindowSize {
  width = 1400,
  height = 900,
}

export enum IpcEvents {
  // 窗口事件
  WINDOW_MINIMIZE = 'WINDOW_MINIMIZE', // 窗口最小化
  WINDOW_MAXIMIZE = 'WINDOW_MAXIMIZE',
  WINDOW_CLOSE = 'WINDOW_CLOSE',

  // 加解密
  CRYPTO_CREATE_HASH = 'CRYPTO_CREATE_HASH',
  CRYPTO_CREATE_HMAC = 'CRYPTO_CREATE_HMAC',
}
