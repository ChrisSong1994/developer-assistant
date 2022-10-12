import os from 'os';
import path from 'path';

const sep = path.sep;

// 判断是否是在win中
export function isInWin() {
  return os.platform() === 'win32';
}

// 是否是在mac
export function isInMac() {
  return os.platform() === 'darwin';
}

// 获取上层路径 mac
export function fetchParentPathForMac(childPath: string) {
  // 判断环境
  const parentPath =
    process.env.NODE_ENV === 'development'
      ? path.resolve(childPath, `..${sep}..${sep}..${sep}..`)
      : path.resolve(childPath, `..${sep}..`);
  return parentPath;
}

// 获取上层路径 win
export function fetchParentPathForWin(appPath: string) {
  let temp;
  let idx = appPath.lastIndexOf('\\');
  if (idx > -1) {
    temp = appPath.substring(0, idx);
    idx = temp.lastIndexOf('\\');
    if (idx > -1) {
      return appPath.substring(0, idx);
    }
  }
  return appPath;
}

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
