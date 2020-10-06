"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const websocket_application_1 = require("../../websocket.application");
const application_1 = require("../fixtures/application");
const keys_1 = require("../../keys");
const dummy_socket_1 = require("../fixtures/dummy-socket");
const ws_controllers_1 = require("../fixtures/ws-controllers");
const core_1 = require("@loopback/core");
describe('WebsocketControllerFactory', () => {
    let app;
    const dummySocket = new dummy_socket_1.DummySocket();
    before(async () => {
        app = new websocket_application_1.WebsocketApplication();
    });
    it('must instance a ws controller factory', () => {
        testlab_1.expect(!!application_1.getNewFactory(app, ws_controllers_1.DummyTestController, dummySocket)).to.be.true();
    });
    describe('after create WebsocketControllerFactory instance', () => {
        let factory;
        let createdController;
        before(async () => {
            factory = application_1.getNewFactory(app, ws_controllers_1.MethodsTestController, dummySocket);
            createdController = await factory.create();
        });
        it('.create must return a instance of controller for a socket connection', () => {
            testlab_1.expect(createdController).to.be.a.instanceOf(ws_controllers_1.MethodsTestController);
        });
        it('must bind socket', () => {
            const socket = factory.connCtx.getSync(keys_1.WebsocketBindings.SOCKET);
            testlab_1.expect(socket).to.be.equal(dummySocket);
        });
        it('must bind controller constructor', () => {
            const controllerConstructor = factory.connCtx.getSync(core_1.CoreBindings.CONTROLLER_CLASS);
            testlab_1.expect(controllerConstructor).to.be.equal(ws_controllers_1.MethodsTestController);
        });
        it('must bind controller instance', () => {
            const controllerInstance = factory.connCtx.getSync(core_1.CoreBindings.CONTROLLER_CURRENT);
            testlab_1.expect(controllerInstance).to.be.equal(createdController);
        });
        it('get decorated methods for @ws.connect()', () => {
            const methodsForConnection = factory.getDecoratedMethodsForConnect();
            testlab_1.expect(methodsForConnection).to.be.containEql({
                onConnectOne: true,
                onConnectTwo: true,
            });
        });
        it('get decorated methods for @ws.subscription() by string and by regex', () => {
            const methodsResult = factory.getDecorateSubscribeMethodsByEventName();
            testlab_1.expect(methodsResult).to.be.containEql({
                firstEventName1: {
                    matcher: 'firstEventName1',
                    methodNames: ['firstMethod', 'topMethods'],
                },
                firstEventName2: {
                    matcher: 'firstEventName2',
                    methodNames: ['firstMethod', 'topMethods'],
                },
                secondEventName: {
                    matcher: 'secondEventName',
                    methodNames: ['secondMethod', 'topMethods'],
                },
                thirdEventName: {
                    matcher: 'thirdEventName',
                    methodNames: ['thirdMethod', 'topMethods'],
                },
                '/^otherSecondEventName$/': {
                    matcher: /^otherSecondEventName$/,
                    methodNames: ['secondMethod', 'topMethods'],
                },
                '/^fourthEventName$/': {
                    matcher: /^fourthEventName$/,
                    methodNames: ['fourthMethod1', 'fourthMethod2'],
                },
                '/^fifthEventName$/': {
                    matcher: /^fifthEventName$/,
                    methodNames: ['fifthMethod'],
                },
                disconnect: {
                    matcher: 'disconnect',
                    methodNames: ['onDisconnect'],
                },
            });
        });
    });
});
//# sourceMappingURL=websocket-controller-factory.test.js.map