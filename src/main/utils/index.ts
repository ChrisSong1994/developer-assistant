import { protocol } from 'electron';
import os from 'os';
import * as path from 'path';
import { URL } from 'url';

export const createProtocol = (scheme: string) => {
  protocol.registerFileProtocol(scheme, (request, respond) => {
    let pathName = new URL(request.url).pathname;
    pathName = decodeURI(pathName); // Needed in case URL contains spaces

    const filePath = path.join(__dirname, pathName);
    respond({ path: filePath });
  });
};

// 判断是否是在win中
export function isInWin() {
  return os.platform() === 'win32';
}

// 是否是在mac
export function isInMac() {
  return os.platform() === 'darwin';
}
