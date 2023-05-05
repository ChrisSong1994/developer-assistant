import * as events from './events';

export type Events = typeof events;

export interface EventData {
  eventName: keyof Events;
  data?: any;
}

declare global {
  var mainWindow: any;
  var launchWindow :any;
}
