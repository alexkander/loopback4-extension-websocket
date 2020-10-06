"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketApplication = void 0;
const core_1 = require("@loopback/core");
const websocket_component_1 = require("./websocket.component");
const keys_1 = require("./keys");
class WebsocketApplication extends core_1.Application {
    constructor(options = {}) {
        super(options);
        this.component(websocket_component_1.WebsocketComponent);
    }
    get websocketServer() {
        return this.getSync(keys_1.WebsocketBindings.WEBSOCKET_SERVER_CLASS);
    }
    async start() {
        await this.websocketServer.start();
    }
    async stop() {
        await this.websocketServer.stop();
    }
}
exports.WebsocketApplication = WebsocketApplication;
//# sourceMappingURL=websocket.application.js.map