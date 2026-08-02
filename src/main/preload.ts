import { contextBridge, ipcRenderer } from 'electron';
import os from 'os';

import dispatch from '../main/dispatch';

const apiKey = 'electronBridge';

// 主进程 → 渲染进程推送通道白名单
const PUSH_CHANNELS = ['imageCompress:item', 'imageConvert:item'];

const api: any = {
  platform: os.platform(),
  versions: process.versions,
  dispatch: dispatch,
  on: (channel: string, callback: (data: any) => void) => {
    if (!PUSH_CHANNELS.includes(channel)) return () => {};
    const listener = (_event: any, data: any) => callback(data);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
};

contextBridge.exposeInMainWorld(apiKey, api);
