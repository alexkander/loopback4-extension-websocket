"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodsTestController = exports.METHODS_TEST_CONTROLER_NSP = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("../../../decorators");
exports.METHODS_TEST_CONTROLER_NSP = '/with-methods/ws';
let MethodsTestController = class MethodsTestController {
    constructor() {
        this.calledMethods = {
            onConnectOne: 0,
            onConnectTwo: 0,
            firstMethod: 0,
            secondMethod: 0,
            thirdMethod: 0,
            topMethods: 0,
            onDisconnect: 0,
            fourthMethod1: 0,
            fourthMethod2: 0,
            fifthMethod: 0,
        };
    }
    onConnectOne() {
        this.calledMethods.onConnectOne += 1;
    }
    onConnectTwo() {
        this.calledMethods.onConnectTwo += 1;
    }
    firstMethod() {
        this.calledMethods.firstMethod += 1;
    }
    secondMethod() {
        this.calledMethods.secondMethod += 1;
    }
    thirdMethod() {
        this.calledMethods.thirdMethod += 1;
    }
    topMethods() {
        this.calledMethods.topMethods += 1;
    }
    fourthMethod1() {
        this.calledMethods.fourthMethod1 += 1;
    }
    fourthMethod2() {
        this.calledMethods.fourthMethod2 += 1;
    }
    fifthMethod() {
        this.calledMethods.fifthMethod += 1;
    }
    onDisconnect() {
        this.calledMethods.onDisconnect += 1;
    }
};
tslib_1.__decorate([
    decorators_1.ws.connect(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MethodsTestController.prototype, "onConnectOne", null);
tslib_1.__decorate([
    decorators_1.ws.connect(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MethodsTestController.prototype, "onConnectTwo", null);
tslib_1.__decorate([
    decorators_1.ws.subscribe('firstEventName1', 'firstEventName2'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MethodsTestController.prototype, "firstMethod", null);
tslib_1.__decorate([
    decorators_1.ws.subscribe('secondEventName', /^otherSecondEventName$/),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MethodsTestController.prototype, "secondMethod", null);
tslib_1.__decorate([
    decorators_1.ws.subscribe('thirdEventName'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MethodsTestController.prototype, "thirdMethod", null);
tslib_1.__decorate([
    decorators_1.ws.subscribe('firstEventName1', 'firstEventName2', 'secondEventName', /^otherSecondEventName$/, 'thirdEventName'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MethodsTestController.prototype, "topMethods", null);
tslib_1.__decorate([
    decorators_1.ws.subscribe(/^fourthEventName$/),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MethodsTestController.prototype, "fourthMethod1", null);
tslib_1.__decorate([
    decorators_1.ws.subscribe(/^fourthEventName$/),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MethodsTestController.prototype, "fourthMethod2", null);
tslib_1.__decorate([
    decorators_1.ws.subscribe(/^fifthEventName$/),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MethodsTestController.prototype, "fifthMethod", null);
tslib_1.__decorate([
    decorators_1.ws.disconnect(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MethodsTestController.prototype, "onDisconnect", null);
MethodsTestController = tslib_1.__decorate([
    decorators_1.ws.controller(exports.METHODS_TEST_CONTROLER_NSP)
], MethodsTestController);
exports.MethodsTestController = MethodsTestController;
//# sourceMappingURL=methods-test.controller.js.map