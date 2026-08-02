import Store from 'electron-store';
import { getUserDataPath, getDownloadsPath } from '@/main/utils';
import { EWindowSize } from '@/common/constants';

export interface IConfigData {
  downloadPath: string;
  checkUpdate: boolean;
  sider_menus: Array<string>;
  other_menus: Array<string>;
  active_menu_key: string | undefined;
  more_active_menu_key: string | undefined;
  screen_size_fixed: boolean; // 屏幕尺寸固定
  screen_size: {
    // 屏幕尺寸
    width: number;
    height: number;
  };
}

// 应用配置
export const configStore = new Store<IConfigData>({
  name: 'config',
  cwd: getUserDataPath(),
  defaults: {
    downloadPath: getDownloadsPath(),
    checkUpdate: false,
    sider_menus: ['Color', 'JSON', 'Regexp', 'Image', 'Diff', 'UrlParse', 'QrCode'],
    other_menus: ['Transform', 'Transcoding', 'Encryption', 'Markdown', 'ImageConvert'],
    active_menu_key: undefined,
    more_active_menu_key: undefined,
    screen_size_fixed: false,
    screen_size: {
      width: EWindowSize.width,
      height: EWindowSize.height,
    },
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

export const getWindowSize = () => {
  // @ts-ignore
  if (configStore.store.screen_size_fixed) {
    // @ts-ignore
    return configStore.get('screen_size');
  }
  return {
    height: EWindowSize.height,
    width: EWindowSize.width,
  };
};
