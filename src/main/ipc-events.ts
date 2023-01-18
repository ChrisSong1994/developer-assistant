import { ipcMain, app, BrowserWindow } from 'electron';
import { IpcEvents } from '../../types/ipc-events';

export default (mainWindow: any) => {
  ipcMain.on(IpcEvents.WINDOW_MINIMIZE, () => {
    mainWindow.minimize();
    mainWindow.setResizable(true);
  });

  ipcMain.on(IpcEvents.WINDOW_MAXIMIZE, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
    // global.mainWindow.setMinimumSize(1600, 900)
    mainWindow.setMinimumSize(1200, 800);
    mainWindow.center();
  });

  ipcMain.on(IpcEvents.WINDOW_CLOSE, () => {
    mainWindow.close();
  });
};
