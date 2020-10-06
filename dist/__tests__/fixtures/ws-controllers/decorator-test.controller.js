"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoratorTestController = exports.DECORATOR_TEST_CONTROLER_NSP = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("../../../decorators");
exports.DECORATOR_TEST_CONTROLER_NSP = '/decorators/ws';
let DecoratorTestController = class DecoratorTestController {
    methodMustReturnSocket(socket) {
        return socket;
    }
    methodMustReturnIoInstance(io) {
        return io;
    }
    methodMustReturnNamespace(nsp) {
        return nsp;
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, decorators_1.ws.socket()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], DecoratorTestController.prototype, "methodMustReturnSocket", null);
tslib_1.__decorate([
    tslib_1.__param(0, decorators_1.ws.io()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], DecoratorTestController.prototype, "methodMustReturnIoInstance", null);
tslib_1.__decorate([
    tslib_1.__param(0, decorators_1.ws.namespace('decoratorNsp')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], DecoratorTestController.prototype, "methodMustReturnNamespace", null);
DecoratorTestController = tslib_1.__decorate([
    decorators_1.ws.controller({
        name: 'decoratorNsp',
        namespace: exports.DECORATOR_TEST_CONTROLER_NSP,
    })
], DecoratorTestController);
exports.DecoratorTestController = DecoratorTestController;
//# sourceMappingURL=decorator-test.controller.js.map