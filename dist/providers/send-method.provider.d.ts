import { Provider } from '@loopback/core';
import { WebsocketSendMethod } from '../types';
export declare class WebsocketSendProvider implements Provider<WebsocketSendMethod> {
    value(): WebsocketSendMethod;
    action(done: Function, result: unknown): Promise<void>;
}
