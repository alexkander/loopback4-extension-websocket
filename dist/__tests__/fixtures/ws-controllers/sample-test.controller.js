"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleTestController = exports.SAMPLE_CONTROLER_NSP = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("../../../decorators");
exports.SAMPLE_CONTROLER_NSP = '/sample/ws';
let SampleTestController = class SampleTestController {
    oneMethod({ randomNumber }) {
        return {
            text: `the number is ${randomNumber}`,
        };
    }
    anotherMethod({ randomNumber }, socket) {
        socket.emit('anotherEvent response', `this is another number: ${randomNumber}`);
    }
};
tslib_1.__decorate([
    decorators_1.ws.subscribe('oneEvent'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], SampleTestController.prototype, "oneMethod", null);
tslib_1.__decorate([
    decorators_1.ws.subscribe('anotherEvent'),
    tslib_1.__param(1, decorators_1.ws.socket()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], SampleTestController.prototype, "anotherMethod", null);
SampleTestController = tslib_1.__decorate([
    decorators_1.ws.controller(exports.SAMPLE_CONTROLER_NSP)
], SampleTestController);
exports.SampleTestController = SampleTestController;
//# sourceMappingURL=sample-test.controller.js.map