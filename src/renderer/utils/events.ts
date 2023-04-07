// @ts-ignore
const { dispatch } = window.electronBridge;
import { Events } from '../../main/types';

const events: Events = new Proxy(
  {},
  {
    get(_target, key: keyof Events) {
      return (params: any): Promise<any> =>
        dispatch('x_event', {
          eventName: key,
          data: params,
        });
    },
  },
) as Events;

export default events;
