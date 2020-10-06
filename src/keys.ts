import { BindingKey, CoreBindings } from '@loopback/core';
import {
  WebsocketInvokeMethod,
  WebsocketOptions,
  WebsocketRejectMethod,
  WebsocketSendMethod,
  WebsocketSequence,
} from './types';
import { Server, ServerOptions, Socket } from 'socket.io';
import { WebsocketServer } from './websocket.server';
import { RequestListener } from '@loopback/http-server';

export namespace WebsocketBindings {
  export const CONFIG: BindingKey<WebsocketOptions> = CoreBindings.APPLICATION_CONFIG.deepProperty(
    'websocket.server'
  );
  export const OPTIONS: BindingKey<ServerOptions> = CoreBindings.APPLICATION_CONFIG.deepProperty(
    'websocket.options'
  );
  export const IO = BindingKey.create<Server>('ws.server');
  export const REQUEST_LISTENER = BindingKey.create<RequestListener>(
    'ws.request.handler'
  );
  export const WEBSOCKET_SERVER_CLASS = BindingKey.create<WebsocketServer>(
    'ws.server.class'
  );
  export const SOCKET = BindingKey.create<Socket>('ws.socket');
  export const NAMESPACE_KEY_FORMAT = `ws.namespace.[META_NAME]`;
  export const getNamespaceKeyForName = (name: string) =>
    NAMESPACE_KEY_FORMAT.split('[META_NAME]').join(name);

  export const SEQUENCE = BindingKey.create<WebsocketSequence>('ws.sequence');

  export const INVOKE_METHOD = BindingKey.create<WebsocketInvokeMethod>(
    'ws.sequence.invokeMethod'
  );
  export const SEND_METHOD = BindingKey.create<WebsocketSendMethod>(
    'ws.sequence.sendMethod'
  );
  export const REJECT_METHOD = BindingKey.create<WebsocketRejectMethod>(
    'ws.sequence.rejectMethod'
  );
}

export namespace WebsocketTags {
  export const SOCKET_IO = 'socketio';
}
