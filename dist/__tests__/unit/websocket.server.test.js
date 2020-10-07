"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const core_1 = require("@loopback/core");
const websocket_server_1 = require("../../websocket.server");
const keys_1 = require("../../keys");
const websocket_component_1 = require("../../websocket.component");
const ws_controllers_1 = require("../fixtures/ws-controllers");
describe('WebsocketServer', () => {
    let io;
    let app, websocketServer;
    before(() => {
        app = new core_1.Application();
        app.component(websocket_component_1.WebsocketComponent);
        websocketServer = new websocket_server_1.WebsocketServer(app);
        io = app.getSync(keys_1.WebsocketBindings.IO);
    });
    it('app bind io Server instance', async () => {
        testlab_1.expect(io).to.be.not.null();
        // TODO: Check is a Server instance
        testlab_1.expect(io).to.be.a.instanceOf(Object);
    });
    it('must return io instance when registry without string route', () => {
        const nsp = websocketServer.route(ws_controllers_1.DummyTestController);
        testlab_1.expect(nsp).to.be.equal(io);
        // TODO: Check is a Namespace instance
        testlab_1.expect(nsp).to.be.a.instanceOf(Object);
    });
    it('must return a nsp when a string route is specific it', () => {
        const stringNamespace = '/route/to/connect';
        const nsp = websocketServer.route(ws_controllers_1.DummyTestController, stringNamespace);
        testlab_1.expect(nsp.name).to.be.equal(stringNamespace);
    });
    it('must return a nsp when a regex route is specific it', () => {
        const regexNamespace = /\/regexnamespace/;
        const nsp = websocketServer.route(ws_controllers_1.DummyTestController, regexNamespace);
        // TODO: Check namespace regex
        testlab_1.expect(!!nsp.name).to.be.true();
    });
    it('must regsitry bind with the nsp when a name option is specific it', () => {
        const optionsName = 'customName';
        const nsp = websocketServer.route(ws_controllers_1.DummyTestController, {
            name: optionsName,
        });
        const bindedNsp = app.getSync(websocket_server_1.getNamespaceKeyForName(optionsName));
        testlab_1.expect(bindedNsp).to.be.equal(nsp);
    });
    it('must return a nsp when a controller setup with ws.controller decorator', () => {
        const nsp = websocketServer.route(ws_controllers_1.SampleTestController);
        testlab_1.expect(nsp.name).to.be.equal(ws_controllers_1.SAMPLE_CONTROLER_NSP);
    });
});
//# sourceMappingURL=websocket.server.test.js.map