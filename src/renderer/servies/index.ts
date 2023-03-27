// 主进程通信
import { IpcEvents } from '../../types/global';

type PlainObject = Record<string, any>;

// @ts-ignore
const { dispatch, ipcRenderer } = window.electronBridge;

// 窗口事件
// 窗口最小化
export const minimize = () => {
  dispatch(IpcEvents.WINDOW_MINIMIZE);
};

// 窗口最大化
export const maximize = () => {
  dispatch(IpcEvents.WINDOW_MAXIMIZE);
};

// 窗口关闭
export const winclose = () => {
  dispatch(IpcEvents.WINDOW_CLOSE);
};

// 加解密
export const createHash = async (args: PlainObject) => {
  const res = await dispatch(IpcEvents.CRYPTO_CREATE_HASH, args);
  return res;
};
