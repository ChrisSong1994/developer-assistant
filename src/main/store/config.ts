import Store from 'electron-store';
import { getUserDataPath, getDownloadsPath } from '@/main/utils';

export interface IConfigData {
  downloadPath: string;
  checkUpdate: boolean;
  sider_menus: Array<string>;
  other_menus: Array<string>;
  active_menu_key: string | undefined;
  more_active_menu_key: string | undefined;
}

// 应用配置
export const configStore = new Store<IConfigData>({
  name: 'config',
  cwd: getUserDataPath(),
  defaults: {
    downloadPath: getDownloadsPath(),
    checkUpdate: false,
    sider_menus: ['Color', 'JSON', 'Regexp', 'Image', 'Diff', 'UrlParse', 'QrCode'],
    other_menus: ['Transform', 'Transcoding', 'Encryption', 'Markdown'],
    active_menu_key: undefined,
    more_active_menu_key: undefined,
  },
});

export const getConfData = () => {
  // @ts-ignore
  return configStore.store;
};

export const setConfData = (data: Partial<IConfigData>) => {
  // @ts-ignore
  configStore.store = {
    // @ts-ignore
    ...configStore.store,
    ...data,
  };
};
