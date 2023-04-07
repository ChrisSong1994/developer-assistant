import { app } from 'electron';
import fs from 'fs-extra';
import { Low } from 'lowdb';
// @ts-ignore
import { JSONFile } from 'lowdb/node';
import os from 'os';
import path from 'path';

interface IColorItem {
  value: string;
  title: string;
  key: string;
}

type TColor = Array<IColorItem>;

interface ILocalData {
  color: TColor;
}

const DEFAULT_LOCAL_DATA: ILocalData = {
  color: [
    {
      value: '#C816CD',
      title: '橄榄色',
      key: '#C816CD',
    },
    {
      value: '#1D2E54',
      title: '橄榄色',
      key: '#1D2E54',
    },
  ],
};

interface IConfigData {
  downloadPath: string;
  openAtLogin: boolean;
}

const DEFAULT_CONFIG_DATA: IConfigData = {
  downloadPath: app.getPath('downloads'), //  下载路径
  openAtLogin: false, // 是否开机重启
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
  return confDB.data;
}

async function setConfData(data: Record<string, any>) {
  confDB.data = data;
  await confDB.write();
}

async function getLocalData(): Promise<any> {
  return localDB.data;
}

async function setLocalData(data: Record<string, any>) {
  localDB.data = data;
  await localDB.write();
}

export { localDB, confDB, dbInit, getConfData, setConfData, getLocalData, setLocalData };
