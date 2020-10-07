"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const p_event_1 = tslib_1.__importDefault(require("p-event"));
const application_1 = require("../fixtures/application");
const ws_controllers_1 = require("../fixtures/ws-controllers");
const websocket_application_1 = require("../../websocket.application");
describe('Acceptance of Websocket extension', () => {
    let app;
    before(async () => {
        app = new websocket_application_1.WebsocketApplication({
            websocket: {
                host: '127.0.0.1',
                port: 0,
            },
        });
        app.websocketServer.route(ws_controllers_1.SampleTestController);
        app.websocketServer.route(ws_controllers_1.MethodsTestController);
        await app.start();
    });
    after(async () => {
        await app.stop();
    });
    it('connects to socketio controller', () => application_1.withConnectedSockets(app, ws_controllers_1.SAMPLE_CONTROLER_NSP, async (client, _server) => {
        let err;
        try {
            await p_event_1.default(client, 'connect');
        }
        catch (error) {
            err = error;
        }
        testlab_1.expect(!!err).to.be.false();
    }));
    it('subscribed methods must return the expect value', () => application_1.withConnectedSockets(app, ws_controllers_1.SAMPLE_CONTROLER_NSP, async (client, _server) => {
        const randomNumber = parseInt(`${Math.random() * 1000}`, 10);
        await p_event_1.default(client, 'connect');
        const result = await new Promise((resolve, _reject) => {
            client.emit('oneEvent', { randomNumber }, resolve);
        });
        testlab_1.expect(result).to.be.eql({
            result: {
                text: `the number is ${randomNumber}`,
            },
        });
    }));
    it('emit events to clients', () => application_1.withConnectedSockets(app, ws_controllers_1.SAMPLE_CONTROLER_NSP, async (client, _server) => {
        const randomNumber = parseInt(`${Math.random() * 1000}`, 10);
        const promiseResult = p_event_1.default(client, 'anotherEvent response');
        client.emit('anotherEvent', { randomNumber });
        const result = await promiseResult;
        testlab_1.expect(result).to.be.equal(`this is another number: ${randomNumber}`);
    }));
    it('subscribed methods must be called on', () => application_1.withConnectedSockets(app, ws_controllers_1.SAMPLE_CONTROLER_NSP, async (client, server) => {
        const factory = application_1.getNewFactory(app, ws_controllers_1.MethodsTestController, server);
        const createdController = await factory.create();
        const controller = createdController;
        const emitAntWait = async (eventName, args) => {
            client.emit(eventName, args);
            await p_event_1.default(server, eventName);
        };
        await emitAntWait('firstEventName1', []);
        await emitAntWait('firstEventName2', []);
        await emitAntWait('secondEventName', []);
        await emitAntWait('thirdEventName', []);
        await emitAntWait('secondEventName', []);
        await emitAntWait('otherSecondEventName', []);
        await emitAntWait('fourthEventName', []);
        await emitAntWait('fifthEventName', []);
        testlab_1.expect(controller.calledMethods).to.be.containEql({
            onConnectOne: 1,
            onConnectTwo: 1,
            firstMethod: 2,
            secondMethod: 3,
            thirdMethod: 1,
            topMethods: 6,
            onDisconnect: 0,
            fourthMethod1: 1,
            fourthMethod2: 1,
            fifthMethod: 1,
        });
    }));
});
//# sourceMappingURL=socketio.server.acceptance.js.map