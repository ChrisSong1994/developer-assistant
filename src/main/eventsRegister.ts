import { ipcMain } from 'electron';
import { IpcEvents } from '../types/global';
import { createHash } from './modules/crypto';
import { getConfData, getLocalData, setConfData, setLocalData } from './modules/data';
import { windowClose, windowMaxmize, windowMinimize } from './modules/windows';

export default (mainWindow: any) => {
  // 窗口事件
  ipcMain.handle(IpcEvents.WINDOW_MINIMIZE, (_e) => windowMinimize(mainWindow));
  ipcMain.handle(IpcEvents.WINDOW_MAXIMIZE, (_e) => windowMaxmize(mainWindow));
  ipcMain.handle(IpcEvents.WINDOW_CLOSE, (_e) => windowClose(mainWindow));

  // 加解密
  ipcMain.handle(IpcEvents.CRYPTO_CREATE_HASH, (_e, args) => createHash(args));

  // 数据
  ipcMain.handle(IpcEvents.GET_CONF_DATA, getConfData);
  ipcMain.handle(IpcEvents.SET_CONF_DATA, (_e, args) => setConfData(args));
  ipcMain.handle(IpcEvents.GET_LOCAL_DATA, getLocalData);
  ipcMain.handle(IpcEvents.SET_LOCAL_DATA, (_e, args) => setLocalData(args));
};
