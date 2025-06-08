import Store from 'electron-store';
import { getUserDataPath } from '@/main/utils';
import { IImageCompressInfo } from '@/main/modules/image';

interface IColorItem {
  value: string;
  title: string;
  key: string;
}

export interface IUserData {
  color: Array<IColorItem>;
  images_compress: Array<IImageCompressInfo>;
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
