"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("./keys");
const websocket_server_1 = require("./websocket.server");
const websocket_sequence_1 = require("./websocket.sequence");
const providers_1 = require("./providers");
const booters_1 = require("./booters");
let WebsocketComponent = class WebsocketComponent {
    constructor(app) {
        this.booters = [booters_1.WebsocketBooter];
        this.providers = {
            [keys_1.WebsocketBindings.INVOKE_METHOD.key]: providers_1.WebsocketInvokeMethodProvider,
            [keys_1.WebsocketBindings.SEND_METHOD.key]: providers_1.WebsocketSendProvider,
            [keys_1.WebsocketBindings.REJECT_METHOD.key]: providers_1.WebsocketRejectProvider,
        };
        app
            .bind(keys_1.WebsocketBindings.SERVER)
            .toClass(websocket_server_1.WebsocketServer)
            .inScope(core_1.BindingScope.SINGLETON);
        app.bind(keys_1.WebsocketBindings.REQUEST_LISTENER).to(() => { });
        app.bind(keys_1.WebsocketBindings.SEQUENCE).toClass(websocket_sequence_1.DefaultWebsocketSequence);
    }
};
WebsocketComponent = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__metadata("design:paramtypes", [core_1.Application])
], WebsocketComponent);
exports.WebsocketComponent = WebsocketComponent;
//# sourceMappingURL=websocket.component.js.map