"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const websocket_application_1 = require("../../websocket.application");
const application_1 = require("../fixtures/application");
const dummy_socket_1 = require("../fixtures/dummy-socket");
const keys_1 = require("../../keys");
const ws_controllers_1 = require("../fixtures/ws-controllers");
describe('WebsocketSequence', () => {
    let app;
    let factory;
    const dummySocket = new dummy_socket_1.DummySocket();
    const callMethod = async (methdName, args) => {
        const callback = factory.getCallback(methdName);
        return new Promise((resolve) => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            callback(args, resolve);
        });
    };
    describe('with a default providers values', () => {
        before(async () => {
            app = new websocket_application_1.WebsocketApplication();
            app.websocketServer.route(ws_controllers_1.SequenceTestController);
            factory = application_1.getNewFactory(app, ws_controllers_1.SequenceTestController, dummySocket);
            await factory.create();
        });
        it('callback response with success', async () => {
            const text = 'this is first param';
            const response = await callMethod('responseSuccess', {
                oneParam: text,
            });
            testlab_1.expect(!!response).to.be.true();
            testlab_1.expect(response).to.be.eql({
                result: { text: `yes you are the first params: ${text}` },
            });
        });
        it('callback response with error handling', async () => {
            const text = 'this is another param';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await callMethod('responseError', {
                badParam: text,
            });
            testlab_1.expect(!!response).to.be.true();
            testlab_1.expect(!!response.error).to.be.true();
            testlab_1.expect(response.error).to.have.containEql({
                message: `this is a badParam: ${text}`,
            });
        });
    });
    describe('with a distinct providers values', () => {
        before(async () => {
            app = new websocket_application_1.WebsocketApplication();
            app.websocketServer.route(ws_controllers_1.SequenceTestController);
            factory = application_1.getNewFactory(app, ws_controllers_1.SequenceTestController, dummySocket);
            await factory.create();
            app
                .bind(keys_1.WebsocketBindings.INVOKE_METHOD)
                .to((context, controller, methodName, args) => {
                if (methodName === 'responseSuccess') {
                    return {
                        invoqueMethod: 'customInvoqueMethod',
                        methodName,
                        args,
                    };
                }
                throw new Error('Bad method name');
            });
            app.bind(keys_1.WebsocketBindings.SEND_METHOD).to((done, result) => {
                done({ myBody: result });
            });
            app.bind(keys_1.WebsocketBindings.REJECT_METHOD).to((done, error) => {
                done({ myAppErrorMessage: error.message });
            });
        });
        it('callback response with success', async () => {
            const text = 'this is first param';
            const response = await callMethod('responseSuccess', {
                oneParam: text,
            });
            testlab_1.expect(!!response).to.be.true();
            testlab_1.expect(response).to.be.eql({
                myBody: {
                    invoqueMethod: 'customInvoqueMethod',
                    methodName: 'responseSuccess',
                    args: [{ oneParam: text }],
                },
            });
        });
        it('callback response with error handling', async () => {
            const text = 'this is another param';
            const response = await callMethod('responseError', {
                badParam: text,
            });
            testlab_1.expect(!!response).to.be.true();
            testlab_1.expect(response).to.have.containEql({
                myAppErrorMessage: `Bad method name`,
            });
        });
    });
});
//# sourceMappingURL=websocket.sequence.test.js.map