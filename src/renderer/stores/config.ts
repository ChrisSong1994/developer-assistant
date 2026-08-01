import { atom } from 'jotai';

import Events from '@/renderer/utils/events';
import { IConfigData } from '@/main/store';

const configAtom = atom<IConfigData>();

configAtom.onMount = (setAtom) => {
  Events.getConfData().then(setAtom);
};

export default configAtom;
