import { app } from 'electron';
import path from 'path';

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

export const ICON_PATH = path.join(RESOURCES_PATH, 'icon.png');
