import { ipcMain } from 'electron';
import { IpcEvents } from '../types/global';
import { createHash } from './modules/crypto';
import { windowClose, windowMaxmize, windowMinimize } from './modules/windows';

export default (mainWindow: any) => {
  // 窗口事件
  ipcMain.handle(IpcEvents.WINDOW_MINIMIZE, windowMinimize(mainWindow));
  ipcMain.handle(IpcEvents.WINDOW_MAXIMIZE, windowMaxmize(mainWindow));
  ipcMain.handle(IpcEvents.WINDOW_CLOSE, windowClose(mainWindow));

  // 加解密
  ipcMain.handle(IpcEvents.CRYPTO_CREATE_HASH, (_e, args) => createHash(args));
};
