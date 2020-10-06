import { BindingKey } from '@loopback/core';
import { WebsocketInvokeMethod, WebsocketOptions, WebsocketRejectMethod, WebsocketSendMethod, WebsocketSequence } from './types';
import { Server, ServerOptions, Socket } from 'socket.io';
import { WebsocketServer } from './websocket.server';
import { RequestListener } from '@loopback/http-server';
export declare namespace WebsocketBindings {
    const CONFIG: BindingKey<WebsocketOptions>;
    const OPTIONS: BindingKey<ServerOptions>;
    const IO: BindingKey<Server>;
    const REQUEST_LISTENER: BindingKey<RequestListener>;
    const WEBSOCKET_SERVER_CLASS: BindingKey<WebsocketServer>;
    const SOCKET: BindingKey<Socket>;
    const SEQUENCE: BindingKey<WebsocketSequence>;
    const INVOKE_METHOD: BindingKey<WebsocketInvokeMethod>;
    const SEND_METHOD: BindingKey<WebsocketSendMethod>;
    const REJECT_METHOD: BindingKey<WebsocketRejectMethod>;
    const CONTROLLERS_NAMESPACE = "ws.controllers";
}
export declare namespace WebsocketTags {
    const SOCKET_IO = "websocket";
}
