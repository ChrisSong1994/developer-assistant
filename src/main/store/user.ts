import Store from 'electron-store';
import { getUserDataPath } from '@/main/utils';
import { IImageCompressInfo } from '@/main/modules/image';

interface IColorItem {
  value: string;
  title: string;
  key: string;
}

interface JsonHistoryItem {
  name: string;
  filepath: string;
  time: string;
}
export interface IUserData {
  color: Array<IColorItem>;
  images_compress: Array<IImageCompressInfo>;
  json_history: Array<JsonHistoryItem>;
  // 文本分析模块：可编辑成本价格表（默认值见 renderer 页面 constants）
  text_analysis_price_table?: Array<{
    id: string;
    model: string;
    encoding: 'o200k_base' | 'cl100k_base' | 'p50k_base' | 'r50k_base';
    inputPrice: number;
    outputPrice: number;
    currency: 'USD' | 'CNY';
  }>;
}

export const userStore = new Store<IUserData>({
  name: 'user',
  cwd: getUserDataPath(),
  defaults: {
    color: [
      {
        value: '#1D2E54',
        title: '主题色',
        key: '#1D2E54',
      },
    ],
    images_compress: [],
    json_history: [],
  },
});

export const getUserData = () => {
  // @ts-ignore
  return userStore.store;
};

export const setUserData = (data: Partial<IUserData>) => {
  // @ts-ignore
  userStore.store = {
    // @ts-ignore
    ...userStore.store,
    ...data,
  };
};

export const clearUserData = () => {
  // @ts-ignore
  userStore.clear();
};
