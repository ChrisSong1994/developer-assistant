import * as events from './modules/events';

export type Events = typeof events;

export interface EventData {
  eventName: keyof Events;
  data?: any;
}

declare global {
  var mainWindow: any;
}
