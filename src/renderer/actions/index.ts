// 主进程通信
import { IpcEvents } from '../../types/global';

type PlainObject = Record<string, any>;

// @ts-ignore
const { dispatch, ipcRenderer } = window.electronBridge;

// 窗口事件
export const minimize = () => dispatch(IpcEvents.WINDOW_MINIMIZE);
export const maximize = () => dispatch(IpcEvents.WINDOW_MAXIMIZE);
export const winclose = () => dispatch(IpcEvents.WINDOW_CLOSE);

// 加解密
export const createHash = (args: PlainObject) => dispatch(IpcEvents.CRYPTO_CREATE_HASH, args);

// 数据
export const getLocalData = () => dispatch(IpcEvents.GET_LOCAL_DATA);
export const setLocalData = (args: PlainObject) => {
  return dispatch(IpcEvents.SET_LOCAL_DATA, args);
};
