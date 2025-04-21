import { atom } from 'jotai';

import Events from '@/utils/events';
import { ILocalData } from '../../main/modules/data';

const localAtom = atom<ILocalData>({
  color: [],
  images_compress: [],
  sider_menus: [], // 侧边栏固定菜单

});
localAtom.onMount = (setAtom) => {
  Events.getConfData().then(setAtom);
};

export default localAtom;
