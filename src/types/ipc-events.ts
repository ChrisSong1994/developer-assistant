export enum IpcEvents {
  WINDOW_MINIMIZE = 'WINDOW_MINIMIZE', // 窗口最小化
  WINDOW_MAXIMIZE = 'WINDOW_MAXIMIZE',
  WINDOW_CLOSE = 'WINDOW_CLOSE',
}

export const ipcMainEvents = [IpcEvents.WINDOW_MINIMIZE];
export const ipcRendererEvents = [IpcEvents.WINDOW_MINIMIZE];
