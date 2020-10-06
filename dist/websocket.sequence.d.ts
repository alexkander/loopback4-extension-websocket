import { WebsocketInvokeMethod, WebsocketRejectMethod, WebsocketSendMethod, WebsocketSequence } from './types';
export declare class DefaultWebsocketSequence implements WebsocketSequence {
    protected invoke: WebsocketInvokeMethod;
    protected send: WebsocketSendMethod;
    protected reject: WebsocketRejectMethod;
    constructor(invoke: WebsocketInvokeMethod, send: WebsocketSendMethod, reject: WebsocketRejectMethod);
    handle(methodName: string, args: unknown[], done: Function): Promise<void>;
}
