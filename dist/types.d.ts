import { HttpServerOptions } from '@loopback/http-server';
import { ControllerClass } from '@loopback/core';
import { Context } from '@loopback/context';
export declare type WebsocketOptions = HttpServerOptions;
export interface WebsocketSequence {
    handle(methodName: string, args: unknown[], done: Function): Promise<void>;
}
export declare type WebsocketDoneFunction = (response: unknown) => Promise<void>;
export declare type WebsocketInvokeMethod = (context: Context, controller: ControllerClass, methodName: string, args: unknown[]) => unknown;
export declare type WebsocketSendMethod = (done: Function, result: unknown) => unknown;
export declare type WebsocketRejectMethod = (done: Function, error: Error) => unknown;
