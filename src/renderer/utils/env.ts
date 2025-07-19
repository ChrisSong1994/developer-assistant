
const platform = window?.electronBridge?.platform;

export function isInWin() {
  return platform === 'win32';
}

export function isInMac() {
  return platform === 'darwin';
}

export function isInLinux() {
  return platform === 'linux';
}
