import { atom } from 'jotai';

import Events from '@/renderer/utils/events';
import { ILocalData } from '@/main/db';

const localAtom = atom<ILocalData>({
  color: [],
  images_compress: [],
  sider_menus: [], // 侧边栏固定菜单
  active_menu_key: undefined,
  more_active_menu_key: undefined,
});

localAtom.onMount = (setAtom) => {
  Events.getLocalData().then(setAtom);
};

export default localAtom;
