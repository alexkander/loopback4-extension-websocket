import { Context, ControllerClass } from '@loopback/core';
import { WebsocketInvokeMethod, WebsocketRejectMethod, WebsocketSendMethod, WebsocketSequence } from './types';
export declare class DefaultWebsocketSequence implements WebsocketSequence {
    protected context: Context;
    protected controller: ControllerClass;
    protected invoke: WebsocketInvokeMethod;
    protected send: WebsocketSendMethod;
    protected reject: WebsocketRejectMethod;
    constructor(context: Context, controller: ControllerClass, invoke: WebsocketInvokeMethod, send: WebsocketSendMethod, reject: WebsocketRejectMethod);
    handle(methodName: string, args: unknown[], done: Function): Promise<void>;
}
