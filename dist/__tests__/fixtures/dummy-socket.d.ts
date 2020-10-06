import { Packet } from 'socket.io';
export declare class DummySocket {
    on(_eventName: string | symbol, _cb: (...args: any[]) => void): void;
    use(_cb: (packet: Packet, next: (err?: any) => void) => void): void;
}
