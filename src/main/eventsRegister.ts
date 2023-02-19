import { ipcMain } from 'electron';
import { windowClose, windowMaxmize, windowMinimize } from './modules/windows';
import { IpcEvents } from '../types/window';

export default (mainWindow: any) => {
  // 窗口事件
  ipcMain.handle(IpcEvents.WINDOW_MINIMIZE, windowMinimize(mainWindow));
  ipcMain.handle(IpcEvents.WINDOW_MAXIMIZE, windowMaxmize(mainWindow));
  ipcMain.handle(IpcEvents.WINDOW_CLOSE, windowClose(mainWindow));

  //
};
