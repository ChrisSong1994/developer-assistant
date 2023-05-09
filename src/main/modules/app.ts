import { app, shell } from 'electron';
import fs from 'fs-extra';
import { PACKAGE_PATH } from '../utils/path';

export const packages = fs.readJSONSync(PACKAGE_PATH);

export const getAppVersion = () => packages.version;

// auto open at login
export const getOpenAtLogin = () => {
  const { openAtLogin } = app.getLoginItemSettings();
  return openAtLogin;
};

export const setOpenAtLogin = (openAtLogin: boolean) => {
  app.setLoginItemSettings({ openAtLogin });
  return openAtLogin;
};

export const quit = () => app.quit();

export const openUrl = ({ url }: { url: string }) => shell.openExternal(url);
