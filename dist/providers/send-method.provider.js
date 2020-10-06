"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketSendProvider = void 0;
class WebsocketSendProvider {
    value() {
        return (done, result) => this.action(done, result);
    }
    async action(done, result) {
        done({ result });
    }
}
exports.WebsocketSendProvider = WebsocketSendProvider;
//# sourceMappingURL=send-method.provider.js.map