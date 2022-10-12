// 主进程通信
import { ipcRenderer } from 'electron';
import { message } from 'antd';
import { to } from './index';

// 同步通信
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
