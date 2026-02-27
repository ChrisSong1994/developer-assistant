
type Handler<T = any> = (data: T) => void;
type Unsubscriber = () => void;

const subscribers: Record<string, Handler[]> = {};

export function subscribe<T = any>(topic: string, handler: Handler<T>): Unsubscriber {
  let handlers = subscribers[topic];
  if (!handlers) {
    handlers = subscribers[topic] = [];
  }
  if (handlers.indexOf(handler) === -1) {
    handlers.push(handler);
  }

  return () => {
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  };
}

export function publish<T = any>(topic: string, data?: T): void {
  if (subscribers[topic]) {
    setTimeout(function callSubscribers() {
      if (subscribers[topic]) {
        const handlers = subscribers[topic];
        for (let i = 0; i < handlers.length; i++) {
          handlers[i](data!);
        }
      }
    }, 0);
  }
}

export function clear(unsubscribers: Unsubscriber[]): void {
  unsubscribers.forEach(call);
}

function call(f: Unsubscriber): void {
  return f();
}
