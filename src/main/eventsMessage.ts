import { ipcMain } from 'electron';
import * as events from './modules/events';
import { EventData } from './types';
export default () => {
  ipcMain.handle('x_event', (_e, args: EventData) => {
    const { eventName, data } = args;
    const func = events[eventName];
    if (typeof func !== 'function') return;
    return func(data);
  });

  // // 窗口事件
  // ipcMain.handle(IpcEvents.WINDOW_MINIMIZE, (_e) => windowMinimize(mainWindow));
  // ipcMain.handle(IpcEvents.WINDOW_MAXIMIZE, (_e) => windowMaxmize(mainWindow));
  // ipcMain.handle(IpcEvents.WINDOW_CLOSE, (_e) => windowClose(mainWindow));

  // // 加解密
  // ipcMain.handle(IpcEvents.CRYPTO_CREATE_HASH, (_e, args) => createHash(args));

  // // 数据
  // ipcMain.handle(IpcEvents.GET_CONF_DATA, getConfData);
  // ipcMain.handle(IpcEvents.SET_CONF_DATA, (_e, args) => setConfData(args));
  // ipcMain.handle(IpcEvents.GET_LOCAL_DATA, getLocalData);
  // ipcMain.handle(IpcEvents.SET_LOCAL_DATA, (_e, args) => setLocalData(args));

  // // app
  // ipcMain.handle(IpcEvents.GET_OPEN_AT_LOGIN, () => getOpenAtLogin());
  // ipcMain.handle(IpcEvents.GET_APP_VERSION, () => getAppVersion());
};
