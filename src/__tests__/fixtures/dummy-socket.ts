import { Packet } from 'socket.io';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OnCallback = (...args: any[]) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseCallback = (packet: Packet, next: (err?: any) => void) => void;

export class DummySocket {
  private onCallbacks = new Map<string | symbol, OnCallback[]>();
  private useCallbacks: UseCallback[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(eventName: string | symbol, cb: (...args: any[]) => void) {
    const callbacks = this.onCallbacks.get(eventName) ?? [];
    callbacks.push(cb);
    this.onCallbacks.set(eventName, callbacks);
    return this;
  }
  use(cb: UseCallback) {
    this.useCallbacks.push(cb);
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  promify(fn: (err?: any) => void) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fn((err?: any) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async simulateEvent(eventName: string, args: any[]) {
    for (const callback of this.useCallbacks) {
      await this.promify((cb) => {
        const packet = [eventName];
        packet.push(...args);
        callback(packet as Packet, cb);
      });
    }
    const callbacks = this.onCallbacks.get(eventName) ?? [];
    for (const callback of callbacks) {
      await this.promify((cb) => {
        callback(args, cb);
      });
    }
  }
}
