import EventEmitter from 'eventemitter3';

export enum EEventBusName {
  CLEAR_LOCAL_DATA = 'CLEAR_LOCAL_DATA',
}

const EventBus = new EventEmitter();

export default EventBus;
