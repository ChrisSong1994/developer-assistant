import { atom } from 'jotai';

import Events from '@/utils/events';
import { IConfigData } from '../../main/modules/data';

const configAtom = atom<IConfigData>({
  checkUpdate: true,
  downloadPath: '',
});

configAtom.onMount = (setAtom) => {
  Events.getConfData().then(setAtom);
};

export default configAtom;
