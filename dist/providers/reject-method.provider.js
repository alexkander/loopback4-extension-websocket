"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketRejectProvider = void 0;
class WebsocketRejectProvider {
    value() {
        return (done, error) => this.action(done, error);
    }
    async action(done, error) {
        done({ error });
    }
}
exports.WebsocketRejectProvider = WebsocketRejectProvider;
//# sourceMappingURL=reject-method.provider.js.map