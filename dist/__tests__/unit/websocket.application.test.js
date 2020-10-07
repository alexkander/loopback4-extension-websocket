"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const websocket_application_1 = require("../../websocket.application");
describe('WebsocketApplication', () => {
    let app;
    before(async () => {
        app = new websocket_application_1.WebsocketApplication();
    });
    it('app bind io Server instance', async () => {
        testlab_1.expect(!!app.websocketServer).to.be.true();
    });
});
//# sourceMappingURL=websocket.application.test.js.map