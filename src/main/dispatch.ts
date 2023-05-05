import { ipcRenderer } from 'electron';

// 异步的
export default async function dispatch(eventName: string, params?: Record<string, any>) {
  return await ipcRenderer.invoke(eventName, params);
}
