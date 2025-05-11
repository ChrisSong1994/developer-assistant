import { app } from 'electron';
import fs from 'fs-extra';
import semver from 'semver';
import fetch from 'node-fetch';
import { to } from '@fett/utils';

import { PACKAGE_PATH } from '../utils/path';
import { GITHUB_PACKAGE_URL } from '@/common/contants';

export const packages = fs.readJSONSync(PACKAGE_PATH);

export const getAppVersion = () => packages.version;

export const checkUpdate = async () => {
  const localVersion = getAppVersion();
  const [res, _err] = await to(
    fetch(GITHUB_PACKAGE_URL, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res: any) => res.json()),
  );
  let isNeedUpdate = false;
  if (res?.version && semver.gt(res?.version, localVersion)) {
    isNeedUpdate = true;
  }
  return {
    isNeedUpdate,
    localVersion,
    remoteVersion: res?.version,
  };
};

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
