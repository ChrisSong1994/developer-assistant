import fs from 'fs-extra';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { getUserDataPath, getDownloadsPath } from '@/main/utils';

export interface IConfigData {
  downloadPath: string;
  checkUpdate: boolean;
}

export const DEFAULT_CONFIG_DATA: IConfigData = {
  downloadPath: getDownloadsPath(),
  checkUpdate: true, // 检查更新
};

const APP_CONFIG_PATH = path.join(getUserDataPath(), 'config.json');

let db: Low<IConfigData>;


export async function configDBRegistory() {
  if (!fs.existsSync(APP_CONFIG_PATH)) {
    await fs.ensureFile(APP_CONFIG_PATH);
    await fs.writeJSON(APP_CONFIG_PATH, DEFAULT_CONFIG_DATA);
  }
  
  db = new Low(new JSONFile(APP_CONFIG_PATH), DEFAULT_CONFIG_DATA);
  
  await db.read();
}

export async function getConfData(): Promise<IConfigData> {
  await db.read();
  
  return db.data;
}

export async function setConfData(data: IConfigData) {
  db.data = data;
  await db.write();
}

export async function updateConfigData(data: Partial<IConfigData>) {
  db.data = { ...db.data, ...data };
  await db.write();
}
