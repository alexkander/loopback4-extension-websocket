"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boot_1 = require("@loopback/boot");
const testlab_1 = require("@loopback/testlab");
const websocket_application_1 = require("../../websocket.application");
const path_1 = tslib_1.__importDefault(require("path"));
const socket_io_client_1 = tslib_1.__importDefault(require("socket.io-client"));
const p_event_1 = tslib_1.__importDefault(require("p-event"));
const ws_controllers_1 = require("../fixtures/ws-controllers");
const websocket_component_1 = require("../../websocket.component");
class BooteablewebsocketApplication extends boot_1.BootMixin(websocket_application_1.WebsocketApplication) {
    constructor(options) {
        super(options);
        this.component(websocket_component_1.WebsocketComponent);
        this.projectRoot = path_1.default.join(__dirname, '../fixtures');
    }
}
describe('WebsocketBooter', () => {
    const givemeAnInstanceApplicaciontionRunning = async () => {
        const app = new BooteablewebsocketApplication({
            websocket: {
                host: '127.0.0.1',
                port: 0,
            },
        });
        await app.boot();
        await app.start();
        return app;
    };
    it('boot the applicacion dont must generate a error', async () => {
        let err;
        try {
            await givemeAnInstanceApplicaciontionRunning();
        }
        catch (error) {
            err = error;
            console.log(err);
        }
        testlab_1.expect(!!err).to.be.false();
    });
    describe('test connections to expected loaded controllers', () => {
        let app;
        before(async () => {
            app = await givemeAnInstanceApplicaciontionRunning();
        });
        [
            { testMessage: 'dummy test controller', namespace: '' },
            {
                testMessage: 'sample test controller',
                namespace: ws_controllers_1.SAMPLE_CONTROLER_NSP,
            },
            {
                testMessage: 'decorator test controller',
                namespace: ws_controllers_1.DECORATOR_TEST_CONTROLER_NSP,
            },
            {
                testMessage: 'methods test controller',
                namespace: ws_controllers_1.METHODS_TEST_CONTROLER_NSP,
            },
            {
                testMessage: 'sequence test controller',
                namespace: ws_controllers_1.SEQUENCE_TEST_CONTROLER_NSP,
            },
        ].forEach(({ testMessage, namespace }) => {
            it(testMessage, async () => {
                const client = socket_io_client_1.default(app.websocketServer.url + namespace);
                let error;
                try {
                    await p_event_1.default(client, 'connect');
                }
                catch (err) {
                    error = err;
                    console.log('err', err);
                }
                testlab_1.expect(!!error).to.be.false();
            });
        });
    });
});
//# sourceMappingURL=websocket.booter.test.js.map