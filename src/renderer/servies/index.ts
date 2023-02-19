// 主进程通信
import { IpcEvents } from '../../types/window';

type PlainObject = Record<string, any>;

// @ts-ignore
const { dispatch } = window.electronBridge;

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
