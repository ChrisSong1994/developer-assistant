import os from 'os';
/**
 * promise 结果转数组
 */
export function to(promise: Promise<any[]>) {
  return new Promise((resolve) => {
    promise.then(
      (res) => resolve([res, null]),
      (err) => resolve([null, err]),
    );
  });
}

// 判断是否是在win中
export function isInWin() {
  return os.platform() === 'win32';
}

// 是否是在mac
export function isInMac() {
  return os.platform() === 'darwin';
}
