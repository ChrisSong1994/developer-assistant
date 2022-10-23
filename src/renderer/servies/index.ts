import { syncAction, asyncAction } from '../utils/ipc';

type PlainObject = Record<string, any>;

export const getAppPath = () => syncAction('getAppPath');

export const generateKey = (params: PlainObject) => asyncAction('generateKey', params);

export const minimize = () => syncAction('window-min');
export const maximize = () => syncAction('window-max');
export const winclose = () => syncAction('window-close');
