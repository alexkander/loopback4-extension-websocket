"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketTags = exports.WebsocketBindings = void 0;
const core_1 = require("@loopback/core");
var WebsocketBindings;
(function (WebsocketBindings) {
    WebsocketBindings.CONFIG = core_1.CoreBindings.APPLICATION_CONFIG.deepProperty('websocket.config');
    WebsocketBindings.OPTIONS = core_1.CoreBindings.APPLICATION_CONFIG.deepProperty('websocket.options');
    WebsocketBindings.IO = core_1.BindingKey.create('ws.server');
    WebsocketBindings.REQUEST_LISTENER = core_1.BindingKey.create('ws.request.handler');
    WebsocketBindings.SERVER = core_1.BindingKey.create('ws.server.class');
    WebsocketBindings.SOCKET = core_1.BindingKey.create('ws.socket');
    WebsocketBindings.SEQUENCE = core_1.BindingKey.create('ws.sequence');
    WebsocketBindings.INVOKE_METHOD = core_1.BindingKey.create('ws.sequence.invokeMethod');
    WebsocketBindings.SEND_METHOD = core_1.BindingKey.create('ws.sequence.sendMethod');
    WebsocketBindings.REJECT_METHOD = core_1.BindingKey.create('ws.sequence.rejectMethod');
    WebsocketBindings.CONTROLLERS_NAMESPACE = 'ws.controllers';
})(WebsocketBindings = exports.WebsocketBindings || (exports.WebsocketBindings = {}));
var WebsocketTags;
(function (WebsocketTags) {
    WebsocketTags.SOCKET_IO = 'websocket';
})(WebsocketTags = exports.WebsocketTags || (exports.WebsocketTags = {}));
//# sourceMappingURL=keys.js.map