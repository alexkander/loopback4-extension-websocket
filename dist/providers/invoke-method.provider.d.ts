import { Context, ControllerClass, Provider } from '@loopback/core';
import { WebsocketInvokeMethod } from '../types';
export declare class WebsocketInvokeMethodProvider implements Provider<WebsocketInvokeMethod> {
    constructor();
    value(): WebsocketInvokeMethod;
    action(context: Context, controller: ControllerClass, methodName: string, args: unknown[]): any;
}
