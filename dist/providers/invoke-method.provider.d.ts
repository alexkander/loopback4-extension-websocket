import { Context, ControllerClass, Provider } from '@loopback/core';
import { WebsocketInvokeMethod } from '../types';
export declare class WebsocketInvokeMethodProvider implements Provider<WebsocketInvokeMethod> {
    protected context: Context;
    protected controller: ControllerClass;
    constructor(context: Context, controller: ControllerClass);
    value(): WebsocketInvokeMethod;
    action(methodName: string, args: unknown[]): Promise<any>;
}
