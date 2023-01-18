import {
  syncAction,
  asyncAction,
  handleWindowMinimize,
  handleWindowMaximize,
  handleWindowClose,
} from '../utils/ipc_events';

type PlainObject = Record<string, any>;

export const getAppPath = () => syncAction('getAppPath');

export const generateKey = (params: PlainObject) => asyncAction('generateKey', params);

export const minimize = handleWindowMinimize;
export const maximize = handleWindowMaximize;
export const winclose = handleWindowClose;
