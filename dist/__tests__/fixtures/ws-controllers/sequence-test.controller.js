"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceTestController = exports.SEQUENCE_TEST_CONTROLER_NSP = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("../../../decorators");
exports.SEQUENCE_TEST_CONTROLER_NSP = '/sequences/ws';
let SequenceTestController = class SequenceTestController {
    responseSuccess({ oneParam }) {
        return { text: `yes you are the first params: ${oneParam}` };
    }
    responseError({ badParam }) {
        throw new Error(`this is a badParam: ${badParam}`);
    }
};
SequenceTestController = tslib_1.__decorate([
    decorators_1.ws.controller(exports.SEQUENCE_TEST_CONTROLER_NSP)
], SequenceTestController);
exports.SequenceTestController = SequenceTestController;
//# sourceMappingURL=sequence-test.controller.js.map