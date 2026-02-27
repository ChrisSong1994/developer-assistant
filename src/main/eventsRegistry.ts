import { ipcMain } from 'electron';
import * as events from './events';
import { EventData } from './types';

export default () => {
  ipcMain.handle('x_event', async (_e, args: EventData) => {
    try {
      const { eventName, data } = args;
      const func = events[eventName];
      if (typeof func !== 'function') {
        console.error(`Event ${eventName} not found`);
        return;
      }
      return await (func as any)(data);
    } catch (error) {
      console.error(`Error handling event ${args.eventName}:`, error);
      throw error;
    }
  });
};
