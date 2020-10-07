"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultWebsocketSequence = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("./keys");
let DefaultWebsocketSequence = class DefaultWebsocketSequence {
    constructor(context, controller, invoke, send, reject) {
        this.context = context;
        this.controller = controller;
        this.invoke = invoke;
        this.send = send;
        this.reject = reject;
    }
    async handle(methodName, args, done) {
        try {
            const response = await this.invoke(this.context, this.controller, methodName, args);
            await this.send(done, response);
        }
        catch (err) {
            await this.reject(done, err);
        }
    }
};
DefaultWebsocketSequence = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject.context()),
    tslib_1.__param(1, core_1.inject(core_1.CoreBindings.CONTROLLER_CURRENT)),
    tslib_1.__param(2, core_1.inject(keys_1.WebsocketBindings.INVOKE_METHOD)),
    tslib_1.__param(3, core_1.inject(keys_1.WebsocketBindings.SEND_METHOD)),
    tslib_1.__param(4, core_1.inject(keys_1.WebsocketBindings.REJECT_METHOD)),
    tslib_1.__metadata("design:paramtypes", [core_1.Context, Object, Function, Function, Function])
], DefaultWebsocketSequence);
exports.DefaultWebsocketSequence = DefaultWebsocketSequence;
//# sourceMappingURL=websocket.sequence.js.map