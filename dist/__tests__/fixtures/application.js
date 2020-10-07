"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewFactory = exports.withConnectedSockets = void 0;
const tslib_1 = require("tslib");
const p_event_1 = tslib_1.__importDefault(require("p-event"));
const socket_io_client_1 = tslib_1.__importDefault(require("socket.io-client"));
const websocket_controller_factory_1 = require("../../websocket-controller-factory");
const keys_1 = require("../../keys");
exports.withConnectedSockets = async (app, urlEndpoint, callbacks) => {
    const url = app.websocketServer.url + urlEndpoint;
    const ioServer = app.getSync(keys_1.WebsocketBindings.IO);
    const nsp = ioServer.nsps[urlEndpoint];
    const serverPromise = p_event_1.default(nsp, 'connection');
    const socket = socket_io_client_1.default(url);
    const server = await serverPromise;
    await callbacks(socket, server);
    socket.disconnect();
};
exports.getNewFactory = (app, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
controllerClass, socket) => new websocket_controller_factory_1.WebsocketControllerFactory(app.websocketServer, controllerClass, socket);
//# sourceMappingURL=application.js.map