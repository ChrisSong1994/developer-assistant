import path from 'path';

const sep = path.sep;

export function fetchParentPath(childPath: string) {
  // 判断环境
  const parentPath =
    process.env.NODE_ENV === 'development'
      ? path.resolve(childPath, `..${sep}..${sep}..${sep}..`)
      : path.resolve(childPath, `..${sep}..`);
  return parentPath;
}

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
