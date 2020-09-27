import {BindingKey, CoreBindings} from "@loopback/core";
import {WebsocketOptions} from "./types";
import {Server} from 'socket.io';
import {WebSocketServer} from "./websocket.server";

export namespace WebsocketBindings {
  export const CONFIG: BindingKey<WebsocketOptions> = CoreBindings.APPLICATION_CONFIG.deepProperty(
    'websocket',
  );
  export const SERVER = BindingKey.create<Server>('ws.server');
  export const WEBSOCKET_SERVER_CLASS = BindingKey.create<WebSocketServer>(
    'ws.server.class',
  );
}