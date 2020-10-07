"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ws = exports.getWebsocketMetadata = exports.WEBSOCKET_SUBSCRIBE_METADATA = exports.WEBSOCKET_CONNECT_METADATA = exports.WEBSOCKET_METADATA = void 0;
const context_1 = require("@loopback/context");
const keys_1 = require("../keys");
exports.WEBSOCKET_METADATA = context_1.MetadataAccessor.create('websocket');
exports.WEBSOCKET_CONNECT_METADATA = context_1.MetadataAccessor.create('websocket:connect');
exports.WEBSOCKET_SUBSCRIBE_METADATA = context_1.MetadataAccessor.create('websocket:subscribe');
function getWebsocketMetadata(controllerClass) {
    return context_1.MetadataInspector.getClassMetadata(exports.WEBSOCKET_METADATA, controllerClass);
}
exports.getWebsocketMetadata = getWebsocketMetadata;
var ws;
(function (ws) {
    function socket() {
        return context_1.inject(keys_1.WebsocketBindings.SOCKET);
    }
    ws.socket = socket;
    function io() {
        return context_1.inject(keys_1.WebsocketBindings.IO);
    }
    ws.io = io;
    function namespace(name) {
        return context_1.inject(`ws.namespace.${name}`);
    }
    ws.namespace = namespace;
    function controller(spec = {}) {
        if (typeof spec === 'string' || spec instanceof RegExp) {
            spec = { namespace: spec };
        }
        return context_1.ClassDecoratorFactory.createDecorator(exports.WEBSOCKET_METADATA, spec);
    }
    ws.controller = controller;
    /**
     * Decorate a controller method for `connect`
     */
    function connect() {
        return context_1.MethodDecoratorFactory.createDecorator(exports.WEBSOCKET_CONNECT_METADATA, true);
    }
    ws.connect = connect;
    /**
     * Decorate a method to subscribe to socketio events.
     * For example,
     * ```ts
     * @socketio.subscribe('chat message')
     * async function onChat(msg: string) {
     * }
     * ```
     * @param messageTypes
     */
    function subscribe(...messageTypes) {
        return context_1.MethodDecoratorFactory.createDecorator(exports.WEBSOCKET_SUBSCRIBE_METADATA, messageTypes);
    }
    ws.subscribe = subscribe;
    /**
     * Decorate a controller method for `disconnect`
     */
    function disconnect() {
        return subscribe('disconnect');
    }
    ws.disconnect = disconnect;
})(ws = exports.ws || (exports.ws = {}));
//# sourceMappingURL=websocket.decorator.js.map