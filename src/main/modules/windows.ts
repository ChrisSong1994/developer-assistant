import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import path from 'path';
import { EWindowSize } from '@/common/constants';
import { isDev, getPageUrl, isInMac } from '../utils';
import { ICON_PATH } from '../utils/path';

/**
 * launch window
 * @returns {BrowserWindowConstructorOptions}
 */
export function getLaunchWindowOptions(): BrowserWindowConstructorOptions {
  return {
    width: EWindowSize.width,
    height: EWindowSize.height,
    titleBarStyle: 'hidden',
    icon: ICON_PATH,
    resizable: false,
    webPreferences: {
      devTools: true,
    },
  };
}

/**
 * 主进程 window
 * @returns {BrowserWindowConstructorOptions}
 */
export function getMainWindowOptions(): BrowserWindowConstructorOptions {
  return {
    width: EWindowSize.width,
    height: EWindowSize.height,
    minHeight: 810,
    minWidth: 1180,
    frame: false,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: {
      y: 16,
      x: 10,
    },
    resizable: true,
    icon: ICON_PATH,
    show: false,
    webPreferences: {
      devTools: isDev,
      webSecurity: false,
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
export function createMainWindow() {
  let launchWindow: BrowserWindow | null;
  let mainWindow: BrowserWindow | null;
  launchWindow = new BrowserWindow(getLaunchWindowOptions());
  mainWindow = new BrowserWindow(getMainWindowOptions());
  if (isInMac()) {
    launchWindow.setWindowButtonVisibility(false);
  }

  launchWindow.loadURL(getPageUrl('launch'));
  mainWindow.loadURL(getPageUrl('index'));

  mainWindow.webContents.once('dom-ready', () => {
    if (isDev) {
      mainWindow?.webContents.openDevTools();
    }
  });

  // 仅在 macOS 下生效
  mainWindow.on('close', (event: any) => {
    if (global.is_will_quit) {
      mainWindow = null;
    } else {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  globalThis.launchWindow = launchWindow;
  globalThis.mainWindow = mainWindow;
}

/**
 * 创建window
 * @returns {Electron.BrowserWindow}
 */
export function windowInit() {
  BrowserWindow.getFocusedWindow() || createMainWindow();
}

export const windowRenderReady = () => {
  mainWindow.show();
  launchWindow.hide();
};

// 窗口缩小
export const windowMinimize = () => {
  if (global.mainWindow) {
    global.mainWindow.minimize();
    global.mainWindow.setResizable(true);
  }

  return;
};

// 窗口放大
export const windowMaxmize = () => {
  if (global.mainWindow) {
    if (global.mainWindow.isFullScreen()) {
      global.mainWindow.setFullScreen(false);
    } else {
      global.mainWindow.setFullScreen(true);
    }
    global.mainWindow.center();
  }

  return;
};

// 窗口关闭
export const windowClose = () => {
  if (global.mainWindow) {
    if (isInMac()) {
      global.mainWindow.hide();
    } else {
      global.mainWindow.close();
    }
  }

  return;
};


export const isFullScreen = () => { 
  return global.mainWindow?.isFullScreen();
};