import path from 'path';
import { app, BrowserWindow, protocol, Menu, Tray } from 'electron';
import { IpcMainEvent } from 'electron/main';
import createProtocol from 'umi-plugin-electron-builder/lib/createProtocol';
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

import { getOrCreateMainWindow } from './windows';
import { setupAboutPanel } from './about-panel';
import { ipcMainCreate } from './utils/ipcMain';

const isDevelopment = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow;

export async function onReady() {
  getOrCreateMainWindow();
  if (isDevelopment) {
    await installExtension([REACT_DEVELOPER_TOOLS.id, REDUX_DEVTOOLS.id]);
  }
}

app.whenReady().then(onReady);

// mac下关闭窗口回到dock不会关闭进程
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    getOrCreateMainWindow();
  }
});
