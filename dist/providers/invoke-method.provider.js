"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketInvokeMethodProvider = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const core_1 = require("@loopback/core");
let WebsocketInvokeMethodProvider = class WebsocketInvokeMethodProvider {
    constructor(context, controller) {
        this.context = context;
        this.controller = controller;
    }
    value() {
        return (methodName, args) => this.action(methodName, args);
    }
    async action(methodName, args) {
        return context_1.invokeMethod(this.controller, methodName, this.context, args);
    }
};
WebsocketInvokeMethodProvider = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject.context()),
    tslib_1.__param(1, core_1.inject(core_1.CoreBindings.CONTROLLER_CURRENT)),
    tslib_1.__metadata("design:paramtypes", [core_1.Context, Object])
], WebsocketInvokeMethodProvider);
exports.WebsocketInvokeMethodProvider = WebsocketInvokeMethodProvider;
//# sourceMappingURL=invoke-method.provider.js.map