// 主进程通信
import { message } from 'antd';
import { to } from './index';
import { IpcEvents } from '../../types/ipc-events';

// @ts-ignore
const { ipcRenderer } = window.electronBridge;

// 慎用： 同步通信 （阻塞渲染进程直到主进程返回结果）
export const syncAction = (action: string, params?: Record<string, any>) => {
  const data = { action, params };
  return ipcRenderer.sendSync('synchronous-message', data);
};

// 异步通信
export const asyncAction = async (action: string, params?: Record<string, any>) => {
  const data = { action, params };
  const [res, err]: any = await to(ipcRenderer.invoke('asynchronous-message', data));
  if (err) {
    message.error(err.message);
    return false;
  }
  try {
    const result = JSON.parse(res);
    return result;
  } catch (error) {
    message.error(err.message);
    return false;
  }
};

// 窗口最小化
export const handleWindowMinimize = () => {
  ipcRenderer.send(IpcEvents.WINDOW_MINIMIZE);
};

// 窗口最大化
export const handleWindowMaximize = () => {
  ipcRenderer.send(IpcEvents.WINDOW_MAXIMIZE);
};

// 窗口关闭
export const handleWindowClose = () => {
  ipcRenderer.send(IpcEvents.WINDOW_CLOSE);
};
