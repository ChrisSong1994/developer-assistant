import { syncAction, asyncAction } from '../utils/ipc';

type PlainObject = Record<string, any>;

export const getAppPath = () => syncAction('getAppPath');

export const generateKey = (params: PlainObject) => asyncAction('generateKey', params);
