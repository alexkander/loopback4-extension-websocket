"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const context_1 = require("@loopback/context");
const websocket_application_1 = require("../../websocket.application");
const dummy_socket_1 = require("../fixtures/dummy-socket");
const application_1 = require("../fixtures/application");
const keys_1 = require("../../keys");
const ws_controllers_1 = require("../fixtures/ws-controllers");
describe('Websocket decorators', () => {
    let app;
    let factory;
    let createdController;
    let controller;
    let appIo;
    const dummySocket = new dummy_socket_1.DummySocket();
    before(async () => {
        app = new websocket_application_1.WebsocketApplication();
        app.websocketServer.route(ws_controllers_1.DecoratorTestController);
        factory = application_1.getNewFactory(app, ws_controllers_1.DecoratorTestController, dummySocket);
        createdController = await factory.create();
        controller = createdController;
        appIo = await app.get(keys_1.WebsocketBindings.IO);
    });
    it('@ws.socket must inject the socket connection', async () => {
        const socket = await context_1.invokeMethod(controller, 'methodMustReturnSocket', factory.connCtx);
        testlab_1.expect(socket).to.be.equal(dummySocket);
    });
    it('@ws.io must inject SocketIO instance', async () => {
        const io = await context_1.invokeMethod(controller, 'methodMustReturnIoInstance', factory.connCtx);
        testlab_1.expect(io).to.be.equal(appIo);
    });
    it('@ws.namespace must inject a namespace instance', async () => {
        const expectedNsp = appIo.of(ws_controllers_1.DECORATOR_TEST_CONTROLER_NSP);
        const nsp = await context_1.invokeMethod(controller, 'methodMustReturnNamespace', factory.connCtx);
        testlab_1.expect(nsp).to.be.equal(expectedNsp);
    });
});
//# sourceMappingURL=websocket.decorator.test.js.map