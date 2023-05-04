import { ipcMain } from 'electron';
import * as events from './events';
import { EventData } from './types';

export default () => {
  ipcMain.handle('x_event', (_e, args: EventData) => {
    const { eventName, data } = args;
    const func = events[eventName];
    if (typeof func !== 'function') return;
    return func(data);
  });
};
