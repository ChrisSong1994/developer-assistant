import { ipcRenderer } from 'electron';

// 异步的
export default async function dispatch(eventName: string, params?: Record<string, any>) {
  console.log(params);
  const res = await ipcRenderer.invoke(eventName, params);

  console.log(res);
  return res;
}
