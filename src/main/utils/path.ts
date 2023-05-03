import { app } from 'electron';
import path from 'path';

export const PACKAGE_PATH = app.isPackaged
  ? path.join(__dirname, 'package.json')
  : path.join(__dirname, '../../../../package.json');

console.log(PACKAGE_PATH);

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

export const ICON_PATH = path.join(RESOURCES_PATH, 'icon.png');
