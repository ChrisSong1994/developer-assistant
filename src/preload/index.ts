import { contextBridge, ipcRenderer } from 'electron';
import os from 'os';
const apiKey = 'electronBridge';

const api: any = {
  platform: os.platform(),
  versions: process.versions,
  ipcRenderer: ipcRenderer,
};

contextBridge.exposeInMainWorld(apiKey, api);
