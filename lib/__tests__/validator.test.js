"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nock = require("nock");
var ValidatorFactory_1 = require("../ValidatorFactory");
var validators_1 = require("../validators");
var ValidationRules_1 = require("../ValidationRules");
var chai_1 = require("chai");
require("mocha");
require("whatwg-fetch");
require("isomorphic-fetch");
var CUSTOM_VALIDATOR_NAME = 'customEquality';
ValidatorFactory_1.validator.registerValidator(CUSTOM_VALIDATOR_NAME, function (value, rule) {
    return value === rule;
});
describe('Validator', function () {
    it('invokeValidator() should return a function', function () {
        chai_1.expect(ValidatorFactory_1.validator.invokeValidator('test', 'test')).to.be.a('function');
    });
    it('registerValidator() should register a new validator', function () {
        chai_1.expect(validators_1.validators).to.have.property(CUSTOM_VALIDATOR_NAME.toLowerCase());
    });
    it('Custom validator returns true or false', function () {
        chai_1.expect(validators_1.validators[CUSTOM_VALIDATOR_NAME.toLowerCase()](10, 10)).to.equal(true);
        chai_1.expect(validators_1.validators[CUSTOM_VALIDATOR_NAME.toLowerCase()](10, null)).to.equal(false);
    });
    it('pattern validator works as expected', function () {
        var validatorPattern = ValidatorFactory_1.validator.invokeValidator('pattern', /abc/i);
        chai_1.expect(validatorPattern('abc', {})).to.equal(true);
    });
    it('maxlength validator works as expected', function () {
        var validatorMaxlength = ValidatorFactory_1.validator.invokeValidator('maxlength', '10');
        chai_1.expect(validatorMaxlength('abc', {})).to.equal(true);
        chai_1.expect(validatorMaxlength('somelongstring', {})).to.equal(false);
    });
    it('minlength validator works as expected', function () {
        var validatorMaxlength = ValidatorFactory_1.validator.invokeValidator('maxlength', '3');
        chai_1.expect(validatorMaxlength('abc', {})).to.equal(true);
        chai_1.expect(validatorMaxlength('abcd', {})).to.equal(false);
    });
    it('equal validator works as expected', function () {
        var validatorEqual = ValidatorFactory_1.validator.invokeValidator('equal', 'abc');
        chai_1.expect(validatorEqual('abc', {})).to.equal(true);
        chai_1.expect(validatorEqual('abcd', {})).to.equal(false);
    });
    it('required validator works as expected', function () {
        var validatorRequired = ValidatorFactory_1.validator.invokeValidator('required', 'true');
        chai_1.expect(validatorRequired('abc', {})).to.equal(true);
        chai_1.expect(validatorRequired('', {})).to.equal(false);
    });
    it('dependsOn validator works as expected', function () {
        var validatorDependsOn = ValidatorFactory_1.validator.invokeValidator('dependsOn', null);
        chai_1.expect(validatorDependsOn('12345', {})).to.equal(true);
    });
    it('async validator rejects with the error', function () {
        var validatorAsync = ValidatorFactory_1.validator.invokeValidator('async', {
            url: 'http://localhost/api',
            method: 'POST'
        });
        var replyData = { status: 'ERROR', message: 'Not valid' };
        nock('http://localhost')
            .post('/api')
            .reply(200, replyData);
        return validatorAsync('test me', {})
            .then(function () {
            chai_1.assert.ok(false);
        })
            .catch(function (message) {
            chai_1.expect(message).to.equal(replyData.message);
        });
    });
    it('async validator resolves if status not equal to ERROR', function () {
        var validatorAsync = ValidatorFactory_1.validator.invokeValidator('async', {
            url: 'http://localhost/api',
            method: 'POST'
        });
        var replyData = { status: 'SUCCESS' };
        nock('http://localhost')
            .post('/api')
            .reply(200, replyData);
        return validatorAsync('test me', {})
            .then(function (_a) {
            var status = _a.status;
            chai_1.expect(status).to.equal(replyData.status);
        })
            .catch(function (message) {
            chai_1.assert.ok(false);
        });
    });
    it('should throw and error if validator not a function', function () {
        chai_1.expect(function () { return ValidatorFactory_1.validator.registerValidator('test', null); }).to.throw();
    });
    it('should add depended fields into depended rule names', function () {
        chai_1.expect(ValidationRules_1.dependedRuleNames).to.not.include.members(['testDepend']);
        ValidatorFactory_1.validator.registerValidator('testDepend', function () { }, 'field2');
        chai_1.expect(ValidationRules_1.dependedRuleNames).to.include.members(['testDepend']);
    });
});
//# sourceMappingURL=validator.test.js.map