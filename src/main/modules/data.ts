import { app } from 'electron';
import fs from 'fs-extra';
import { Low } from 'lowdb';
// @ts-ignore
import { JSONFile } from 'lowdb/node';
import os from 'os';
import path from 'path';
import { IImageCompressInfo } from './image';

interface IColorItem {
  value: string;
  title: string;
  key: string;
}

export interface ILocalData {
  color: Array<IColorItem>;
  images_compress: Array<IImageCompressInfo>;
  sider_menus: Array<string>;
  active_menu_key: string | undefined;
  more_active_menu_key: string | undefined;
}

export const DEFAULT_LOCAL_DATA: ILocalData = {
  color: [
    {
      value: '#1D2E54',
      title: '主题色',
      key: '#1D2E54',
    },
  ],
  images_compress: [],
  sider_menus: ['Color', 'JSON'],
  active_menu_key: undefined,
  more_active_menu_key: undefined,
};

export interface IConfigData {
  downloadPath: string;
  checkUpdate: boolean;
}

export const DEFAULT_CONFIG_DATA: IConfigData = {
  downloadPath: app.getPath('downloads'), //  下载路径
  checkUpdate: true, // 检查更新
};

export const APP_PATH = path.join(os.homedir(), '.DeveloperAssistant');
export const APP_CONFIG_PATH = path.join(APP_PATH, 'config.json');
export const APP_DATA_PATH = path.join(APP_PATH, 'data.json');

let confDB: Low;
let localDB: Low;

async function dbInit() {
  if (!fs.existsSync(APP_PATH)) {
    await fs.ensureDir(APP_PATH);
  }

  if (!fs.existsSync(APP_CONFIG_PATH)) {
    await fs.writeJSON(APP_CONFIG_PATH, DEFAULT_CONFIG_DATA);
  }

  if (!fs.existsSync(APP_DATA_PATH)) {
    await fs.writeJSON(APP_DATA_PATH, DEFAULT_LOCAL_DATA);
  }

  confDB = new Low(new JSONFile(APP_CONFIG_PATH));
  await confDB.read();
  localDB = new Low(new JSONFile<ILocalData>(APP_DATA_PATH));
  await localDB.read();
}

async function getConfData(): Promise<any> {
  await localDB.read();
  return confDB.data;
}

async function setConfData(data: Record<string, any>) {
  confDB.data = data;
  await confDB.write();
}

async function getLocalData(): Promise<any> {
  await localDB.read();
  return localDB.data;
}

async function setLocalData(data: Record<string, any>) {
  localDB.data = data;
  await localDB.write();
}

async function clearLocalData(key?: string) {
  localDB.data = DEFAULT_LOCAL_DATA;
  await localDB.write();
}

export { localDB, confDB, dbInit, getConfData, setConfData, getLocalData, setLocalData, clearLocalData };
