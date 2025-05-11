import { atom } from 'jotai';

import Events from '@/renderer/utils/events';
import { IConfigData } from '@/main/db';

const configAtom = atom<IConfigData>({
  checkUpdate: false,
  downloadPath: '',
}); 

configAtom.onMount = (setAtom) => {
  Events.getConfData().then(setAtom);
};

export default configAtom;
