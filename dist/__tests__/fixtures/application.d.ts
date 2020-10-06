/// <reference types="socket.io-client" />
import { Constructor } from '@loopback/context';
import { Socket } from 'socket.io';
import { WebsocketApplication } from '../../websocket.application';
import { WebsocketControllerFactory } from '../../websocket-controller-factory';
export declare const withConnectedSockets: (app: WebsocketApplication, urlEndpoint: string, callbacks: (client: SocketIOClient.Socket, server: Socket) => Promise<void>) => Promise<void>;
export declare const getNewFactory: (app: WebsocketApplication, controllerClass: Constructor<any>, socket: Socket) => WebsocketControllerFactory;
