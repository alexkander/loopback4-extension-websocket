"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketInvokeMethodProvider = void 0;
const context_1 = require("@loopback/context");
class WebsocketInvokeMethodProvider {
    constructor() { }
    value() {
        return (context, controller, methodName, args) => this.action(context, controller, methodName, args);
    }
    action(context, controller, methodName, args) {
        return context_1.invokeMethod(controller, methodName, context, args);
    }
}
exports.WebsocketInvokeMethodProvider = WebsocketInvokeMethodProvider;
//# sourceMappingURL=invoke-method.provider.js.map