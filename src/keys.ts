import {BindingKey, ControllerClass, CoreBindings} from "@loopback/core";
import {Constructor} from "@loopback/context";
import {WebsocketOptions} from "./types";
import {Server, Socket} from 'socket.io';
import {WebSocketServer} from "./websocket.server";

export namespace WebsocketBindings {
  export const CONFIG: BindingKey<WebsocketOptions> = CoreBindings.APPLICATION_CONFIG.deepProperty(
    'websocket',
  );
  export const IO = BindingKey.create<Server>('ws.server');
  export const WEBSOCKET_SERVER_CLASS = BindingKey.create<WebSocketServer>(
    'ws.server.class',
  );
  export const CONTROLLER_CONSTRUCTOR = BindingKey.create<Constructor<ControllerClass>>('ws.controller.class');
  export const CONTROLLER_CLASS = BindingKey.create<ControllerClass>(
    'ws.controller',
  );
  export const CONTROLLER_INSTANCE = BindingKey.create<ControllerClass>(
    'ws.controller.instance',
  );
  export const SOCKET = BindingKey.create<Socket>('ws.socket');
  export const NAMESPACE_KEY_FORMAT = `ws.namespace.[META_NAME]`;
  export const getNamespaceKeyForName = (name: string) => NAMESPACE_KEY_FORMAT.split('[META_NAME]').join(name);
}