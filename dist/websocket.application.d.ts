import { Application, ApplicationConfig } from '@loopback/core';
import { WebsocketServer } from './websocket.server';
export declare class WebsocketApplication extends Application {
    constructor(options?: ApplicationConfig);
    get websocketServer(): WebsocketServer;
    start(): Promise<void>;
    stop(): Promise<void>;
}
