import { app } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { isEmpty, qs } from '@fett/utils';

import { isDev } from './env';

export const PACKAGE_PATH = app.isPackaged
  ? path.join(__dirname, './package.json')
  : path.join(__dirname, '../package.json');

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets');

export const ICON_PATH = path.join(RESOURCES_PATH, 'icon.png');

export const ensureFirstBackSlash = (str: string) => {
  return str.length > 0 && str.charAt(0) !== '/' ? '/' + str : str;
};

export const getNotExistFilePath = (filePath: string): string => {
  if (!fs.existsSync(filePath)) return filePath;
  const pathObject = path.parse(filePath);
  let index = 1;
  let newFilePath = path.format({
    ...pathObject,
    name: `${pathObject.name}(${index})`,
    base: `${pathObject.name}(${index})${pathObject.ext}`,
  });
  while (fs.existsSync(newFilePath)) {
    index++;
    newFilePath = path.format({
      ...pathObject,
      name: `${pathObject.name}(${index})`,
      base: `${pathObject.name}(${index})${pathObject.ext}`,
    });
  }

  return newFilePath;
};

export const getPublicFilePath = ({ name }: { name: string }) => {
  const pathName = path.resolve(path.join(__dirname, name)).replace(/\\/g, '/');
  return encodeURI('file://' + ensureFirstBackSlash(pathName));
};

export const getPageUrl = (page: any, query: Record<string, any> = {}) => {
  let url;
  if (isDev) {
    url = `http://localhost:3000/${page}.html`;
  } else {
    url = getPublicFilePath({ name: `${page}.html` });
  }
  return url + (isEmpty(query) ? '' : `?${qs.stringify(query)}`);
};

// 应用程序相关路径
export const getUserDataPath = () => {
  const userDataPath = app.getPath('userData');
  if (isDev) {
    const devDataPath = path.join(__dirname, '../.userdata');
    return devDataPath;
  }
  return userDataPath;
};

export const getHomePath = () => {
  return app.getPath('home');
};

export const getTempPath = () => {
  return app.getPath('temp');
};

export const getDownloadsPath = () => {
  return app.getPath('downloads');
};

export const getLogsPath = () => {
  return app.getPath('logs');
};
