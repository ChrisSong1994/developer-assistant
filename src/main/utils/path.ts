import { app } from 'electron';
import fs from 'fs-extra';
import path from 'path';

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

export const getPublicFilePath = ({ name }: { name: string }) => {
  const pathName = path.resolve(path.join(__dirname, name)).replace(/\\/g, '/');
  return encodeURI('file://' + ensureFirstBackSlash(pathName));
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
