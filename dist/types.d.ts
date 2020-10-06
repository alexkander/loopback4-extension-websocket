import { HttpServerOptions } from '@loopback/http-server';
export declare type WebsocketOptions = HttpServerOptions;
export interface WebsocketSequence {
    handle(methodName: string, args: unknown[], done: Function): Promise<void>;
}
export declare type WebsocketDoneFunction = (reponse: unknown) => Promise<void>;
export declare type WebsocketInvokeMethod = (methodName: string, args: unknown[]) => Promise<Object | never>;
export declare type WebsocketSendMethod = (done: Function, result: unknown) => Promise<void>;
export declare type WebsocketRejectMethod = (done: Function, error: Error) => Promise<void>;
