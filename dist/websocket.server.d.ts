import { BindingFilter, Application, Constructor, Context } from '@loopback/core';
import { HttpServer } from '@loopback/http-server';
import SocketIO, { Namespace, ServerOptions, Socket, Server } from 'socket.io';
import { WebsocketOptions } from './types';
import { WebsocketMetadata } from './decorators';
export declare type SockIOMiddleware = (socket: Socket, fn: (err?: any) => void) => void;
export declare const NAMESPACE_KEY_FORMAT = "ws.namespace.[META_NAME]";
export declare const getNamespaceKeyForName: (name: string) => string;
/**
 * A binding filter to match socket.io controllers
 * @param binding - Binding object
 */
export declare const controllersBindingFilter: BindingFilter;
export declare class WebsocketServer extends Context {
    app: Application;
    protected config: WebsocketOptions;
    protected options: ServerOptions;
    private controllers;
    protected io: Server;
    protected _httpServer: HttpServer;
    constructor(app: Application, config?: WebsocketOptions, options?: ServerOptions);
    get url(): string;
    /**
     * Register a sock.io middleware function
     * @param fn
     */
    use(fn: SockIOMiddleware): SocketIO.Namespace;
    start(): Promise<void>;
    stop(): Promise<void>;
    /**
     * Register a socketio controller
     * @param controllerClass
     * @param meta
     */
    route(controllerClass: Constructor<any>, meta?: WebsocketMetadata | string | RegExp): Namespace | Server;
    protected createSocketHandler(controllerClass: Constructor<any>): (socket: Socket) => Promise<void>;
    /**
     * Register a socket.io controller
     * @param controllerClass
     */
    controller(controllerClass: Constructor<unknown>): import("@loopback/core").Binding<unknown>;
    /**
     * Discover all socket.io controllers and register routes
     */
    discoverAndRegister(): void;
}
