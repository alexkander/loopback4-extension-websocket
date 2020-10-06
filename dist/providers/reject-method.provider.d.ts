import { Provider } from '@loopback/core';
import { WebsocketRejectMethod } from '../types';
export declare class WebsocketRejectProvider implements Provider<WebsocketRejectMethod> {
    value(): WebsocketRejectMethod;
    action(done: Function, error: Error): Promise<void>;
}
