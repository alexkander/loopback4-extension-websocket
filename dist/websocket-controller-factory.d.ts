import { ControllerClass } from '@loopback/core';
import { Constructor, Context, MetadataAccessor } from '@loopback/context';
import { DecoratorType, MetadataMap } from '@loopback/metadata/src/types';
import { Socket } from 'socket.io';
declare type WebsocketEventMatcherInfo = {
    matcher: string | RegExp;
    methodNames: string[];
};
/**
 * Request context for a socket.io request
 */
export declare class WebsocketConnectionContext extends Context {
    readonly socket: Socket;
    constructor(socket: Socket, parent: Context);
}
export declare class WebsocketControllerFactory {
    private controllerClass;
    private controller;
    readonly connCtx: WebsocketConnectionContext;
    constructor(parentCtx: Context, controllerClass: Constructor<ControllerClass>, socket: Socket);
    create(): Promise<{
        [method: string]: Function;
    }>;
    /**
     * Set up the controller for the given socket
     */
    setup(): Promise<void>;
    connect(): Promise<void>;
    protected registerSubscribeMethods(): void;
    getDecoratedMethodsForConnect(): MetadataMap<boolean>;
    getDecorateSubscribeMethodsByEventName(): Map<string, WebsocketEventMatcherInfo>;
    protected getDecorateSubscribeMethods(): MetadataMap<(string | RegExp)[]>;
    protected getAllMethodMetadataForKey<V, DT extends DecoratorType>(metadataAccessor: MetadataAccessor<V, DT>): MetadataMap<V>;
    getCallback(methodName: string): (...args: unknown[]) => Promise<void>;
}
export {};
