import { BrowserWindow, protocol } from 'electron';
import * as path from 'path';
import { EWindowSize } from '../../types/global';
import { createProtocol, isInMac } from '../utils';
import { ICON_PATH } from '../utils/path';

export let browserWindows: Array<BrowserWindow | null> = [];

const isDevelopment = process.env.NODE_ENV === 'development';

// 协议注册
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

/**
 * Gets default options for the main window
 *
 * @returns {Electron.BrowserWindowConstructorOptions}
 */
export function getMainWindowOptions(): Electron.BrowserWindowConstructorOptions {
  return {
    width: EWindowSize.width,
    height: EWindowSize.height,
    titleBarStyle: 'hidden',
    resizable: true,
    icon: ICON_PATH,
    webPreferences: {
      devTools: isDevelopment,
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  };
}

/**
 * 创建窗口
 * @export
 * @returns {Electron.BrowserWindow}
 */
export function createMainWindow(): Electron.BrowserWindow {
  let mainWindow: BrowserWindow | null;
  mainWindow = new BrowserWindow(getMainWindowOptions());
  if (isInMac()) {
    mainWindow.setWindowButtonVisibility(false); // 隐藏信号灯
  }

  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:3001');
  } else {
    createProtocol('app');
    mainWindow.loadURL('app://./index.html');
  }

  mainWindow.webContents.once('dom-ready', () => {
    if (isDevelopment) {
      mainWindow?.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    browserWindows = browserWindows.filter((bw) => mainWindow !== bw);
    mainWindow = null;
  });

  browserWindows.push(mainWindow);

  return mainWindow;
}

/**
 * 创建window
 * @returns {Electron.BrowserWindow}
 */
export function getOrCreateMainWindow(): Electron.BrowserWindow {
  return BrowserWindow.getFocusedWindow() || browserWindows[0] || createMainWindow();
}

// 窗口缩小
export const windowMinimize = (mainWindow: any) => () => {
  mainWindow.minimize();
  mainWindow.setResizable(true);
  return;
};

// 窗口放大
export const windowMaxmize = (mainWindow: any) => () => {
  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false);
  } else {
    mainWindow.setFullScreen(true);
  }
  mainWindow.center();
  return;
};

// 窗口关闭
export const windowClose = (mainWindow: any) => () => {
  if (isInMac()) {
    mainWindow.hide();
  } else {
    mainWindow.close();
  }
  return;
};
