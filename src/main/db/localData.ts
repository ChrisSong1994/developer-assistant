import fs from 'fs-extra';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

import { IImageCompressInfo } from '@/modules/image';
import { getUserDataPath } from '@/utils';

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

const APP_CONFIG_PATH = path.join(getUserDataPath(), 'local.json');

let db: Low<ILocalData>;

export async function LocalDBRegistory() {
  if (!fs.existsSync(APP_CONFIG_PATH)) {
      await fs.ensureFile(APP_CONFIG_PATH)
    await fs.writeJSON(APP_CONFIG_PATH, DEFAULT_LOCAL_DATA);
  }
  db = new Low(new JSONFile(APP_CONFIG_PATH), DEFAULT_LOCAL_DATA);
  await db.read();
}

export async function getLocalData(): Promise<ILocalData> {
  await db.read();
  return db.data;
}

export async function setLocalData(data: ILocalData) {
  db.data = data;
  await db.write();
}

export async function updateLocalData(data: Partial<ILocalData>) {
  db.data = { ...db.data, ...data };
  await db.write();
}

export async function clearLocalData() {
  db.data = DEFAULT_LOCAL_DATA;
  await db.write();
}
