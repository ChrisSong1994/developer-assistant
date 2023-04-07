import { app } from 'electron';
import fs from 'fs-extra';
import { PACKAGE_PATH } from '../utils/path';

export const packages = fs.readJSONSync(PACKAGE_PATH);

export const getAppVersion = () => packages.version;

export const getOpenAtLogin = () => {
  const { openAtLogin } = app.getLoginItemSettings();
  return openAtLogin;
};
