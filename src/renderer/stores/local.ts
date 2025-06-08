import { atom } from 'jotai';

import Events from '@/renderer/utils/events';
import { IUserData } from '@/main/store';

const localAtom = atom<IUserData>();

localAtom.onMount = (setAtom) => {
  Events.getUserData().then(setAtom);
};

export default localAtom;
