import os from 'os';
import isDev from 'electron-is-dev';

export const isDevelopment = isDev;

// 判断是否是在win中
export function isInWin() {
  return os.platform() === 'win32';
}

// 是否是在mac
export function isInMac() {
  return os.platform() === 'darwin';
}

// hex to base64
export function hexToBase64(v: string) {
  return Buffer.from(v, 'hex').toString('base64');
}

// hex to base64
export function Base64ToHex(v: string) {
  return Buffer.from(v, 'base64').toString('hex');
}
