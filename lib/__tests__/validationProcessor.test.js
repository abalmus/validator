"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationProcessor_1 = require("../ValidationProcessor");
var chai_1 = require("chai");
var testData_1 = require("./testData");
require("mocha");
var dependsOnValues = {
    field2: ''
};
var validationProcessor = new ValidationProcessor_1.ValidationProcessor(testData_1.testValidationRules, {
    dependsOnValues: dependsOnValues
});
function waitAsyncValidation() {
    var formatedQueueKey = 'field2__async';
    var queue = validationProcessor.asyncProcessorQueue.queue;
    return new Promise(function (resolve) {
        queue[formatedQueueKey] && queue[formatedQueueKey].catch(function () {
            chai_1.assert.ok(true);
            resolve();
        });
        resolve();
    });
}
describe('ValidationProcessor', function () {
    it('should have validate() method', function () {
        chai_1.expect(validationProcessor.validate).to.be.a('function');
        return waitAsyncValidation();
    });
    it('should set default validation rules if no value provided', function () {
        var _a = extractMinMaxLength(), minlength = _a.minlength, maxlength = _a.maxlength;
        chai_1.expect(Number(minlength)).to.be.equal(1);
        chai_1.expect(Number(maxlength)).to.be.equal(11);
        return waitAsyncValidation();
    });
    it('should detect depends on fields', function () {
        dependsOnValues.field2 = 'DE';
        validationProcessor.validate('field2', 'DE');
        var _a = extractMinMaxLength(), minlength = _a.minlength, maxlength = _a.maxlength;
        chai_1.expect(Number(minlength)).to.be.equal(9);
        chai_1.expect(Number(maxlength)).to.be.equal(99);
        return waitAsyncValidation();
    });
    it('should replace depends on validation rules if country changed', function () {
        dependsOnValues.field2 = 'GB';
        validationProcessor.validate('field2', 'GB');
        var _a = extractMinMaxLength(), minlength = _a.minlength, maxlength = _a.maxlength;
        chai_1.expect(Number(minlength)).to.be.equal(8);
        chai_1.expect(Number(maxlength)).to.be.equal(88);
        return waitAsyncValidation();
    });
    it('should add validation process to the processor queue', function () {
        validationProcessor.validate('field2', 'GB');
        var queue = validationProcessor.processorQueue.queue;
        chai_1.expect(queue).to.have.property('field2__minlength');
        return waitAsyncValidation();
    });
    it('should add async validation process to the async processor queue', function () {
        validationProcessor.validate('field2', 'GB');
        var formatedQueueKey = 'field2__async';
        var queue = validationProcessor.asyncProcessorQueue.queue;
        chai_1.expect(queue).to.have.property(formatedQueueKey);
        return waitAsyncValidation();
    });
    it('should convert validation rules to processors', function () {
        validationProcessor.validate('field2', 'GB');
        var formatedQueueKey = 'field2__async';
        var _a = validationProcessor.__testApi.context.processedConstraints.field2.rules, async = _a.async, minlength = _a.minlength;
        chai_1.expect(async).to.be.a('function');
        chai_1.expect(minlength).to.be.a('function');
        return waitAsyncValidation();
    });
    it('should return current process if new process not provided', function () {
        var _a = validationProcessor.__testApi.context, asyncProcessorQueue = _a.asyncProcessorQueue, processorQueue = _a.processorQueue;
        var formatedQueueKey = 'field2__minlength';
        var asyncFormatedQueueKey = 'field2__async';
        chai_1.expect(asyncProcessorQueue.process('field2', 'async')).to.have.property(asyncFormatedQueueKey);
        chai_1.expect(processorQueue.process('field2', 'minlength')).to.have.property(formatedQueueKey);
        return waitAsyncValidation();
    });
    it('should be able to apply depends on values during validation', function () {
        var resultForDE = validationProcessor.validate('field1', 'text', { field2: 'DE' }).debug();
        chai_1.expect(resultForDE.constraints.rules.field1.minlength).to.equal(9);
        chai_1.expect(resultForDE.constraints.rules.field1.maxlength).to.equal(99);
        var resultForGB = validationProcessor.validate('field1', 'text', { field2: 'GB' }).debug();
        chai_1.expect(resultForGB.constraints.rules.field1.minlength).to.equal(8);
        chai_1.expect(resultForGB.constraints.rules.field1.maxlength).to.equal(88);
    });
    it('should have public resulted api', function () {
        var result = validationProcessor.validate('field1', 'text');
        chai_1.expect(result.debug).to.be.a('function');
    });
});
function extractMinMaxLength() {
    var _a = validationProcessor.__testApi.constraints.rules.field1, minlength = _a.minlength, maxlength = _a.maxlength;
    return {
        minlength: minlength,
        maxlength: maxlength,
    };
}
//# sourceMappingURL=validationProcessor.test.js.map