import * as path from 'path';
import { BrowserWindow, app, protocol } from 'electron';
import createProtocol from 'umi-plugin-electron-builder/lib/createProtocol';

import { IpcEvents } from '../../types/ipc-events';

export let browserWindows: Array<BrowserWindow | null> = [];

const isDevelopment = process.env.NODE_ENV === 'development';
const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

// 协议注册
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

/**
 * Gets default options for the main window
 *
 * @returns {Electron.BrowserWindowConstructorOptions}
 */
export function getMainWindowOptions(): Electron.BrowserWindowConstructorOptions {
  return {
    width: 1400,
    height: 900,
    titleBarStyle: 'hidden',
    resizable: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      devTools: isDevelopment,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  };
}

/**
 * Creates a new main window.
 *
 * @export
 * @returns {Electron.BrowserWindow}
 */
export function createMainWindow(): Electron.BrowserWindow {
  let mainWindow: BrowserWindow | null;

  mainWindow = new BrowserWindow(getMainWindowOptions());

  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:8000');
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
 * Gets or creates the main window, returning it in both cases.
 *
 * @returns {Electron.BrowserWindow}
 */
export function getOrCreateMainWindow(): Electron.BrowserWindow {
  return BrowserWindow.getFocusedWindow() || browserWindows[0] || createMainWindow();
}
