import * as nock from 'nock';

import { validator } from '../ValidatorFactory';
import { validators } from '../validators';
import { dependedRuleNames } from '../ValidationRules';
import { expect, assert } from 'chai';

import 'mocha';
import 'whatwg-fetch';
import 'isomorphic-fetch';

const CUSTOM_VALIDATOR_NAME = 'customEquality'

validator.registerValidator(CUSTOM_VALIDATOR_NAME, (value, rule) => {
    return value === rule;
});

describe('Validator', () => {
    it('invokeValidator() should return a function', () => {
        expect(validator.invokeValidator('test', 'test')).to.be.a('function');
    });

    it('registerValidator() should register a new validator', () => {
        expect(validators).to.have.property(CUSTOM_VALIDATOR_NAME.toLowerCase());
    });

    it('Custom validator returns true or false', () => {
        expect(validators[CUSTOM_VALIDATOR_NAME.toLowerCase()](10, 10)).to.equal(true);
        expect(validators[CUSTOM_VALIDATOR_NAME.toLowerCase()](10, null)).to.equal(false);
    });

    it('pattern validator works as expected', () => {
        const validatorPattern = validator.invokeValidator('pattern', /abc/i);
        expect(validatorPattern('abc', {})).to.equal(true);
    });

    it('maxlength validator works as expected', () => {
        const validatorMaxlength = validator.invokeValidator('maxlength', '10');
        expect(validatorMaxlength('abc', {})).to.equal(true);
        expect(validatorMaxlength('somelongstring', {})).to.equal(false);
    });

    it('minlength validator works as expected', () => {
        const validatorMaxlength = validator.invokeValidator('maxlength', '3');
        expect(validatorMaxlength('abc', {})).to.equal(true);
        expect(validatorMaxlength('abcd', {})).to.equal(false);
    });

    it('equal validator works as expected', () => {
        const validatorEqual = validator.invokeValidator('equal', 'abc');
        expect(validatorEqual('abc', {})).to.equal(true);
        expect(validatorEqual('abcd', {})).to.equal(false);
    });

    it('required validator works as expected', () => {
        const validatorRequired = validator.invokeValidator('required', 'true');
        expect(validatorRequired('abc', {})).to.equal(true);
        expect(validatorRequired('', {})).to.equal(false);
    });

    it('dependsOn validator works as expected', () => {
        const validatorDependsOn = validator.invokeValidator('dependsOn', null);
        expect(validatorDependsOn('12345', {})).to.equal(true);
    });

    it('async validator rejects with the error', () => {
        const validatorAsync = validator.invokeValidator('async', {
            url: 'http://localhost/api',
            method: 'POST'
        });

        const replyData = {status: 'ERROR', message: 'Not valid'};

        nock('http://localhost')
            .post('/api')
            .reply(200, replyData);

        return validatorAsync('test me', {})
        .then(() => {
            assert.ok(false);
        })
        .catch((message) => {
            expect(message).to.equal(replyData.message);
        });
    });

    it('async validator resolves if status not equal to ERROR', () => {
        const validatorAsync = validator.invokeValidator('async', {
            url: 'http://localhost/api',
            method: 'POST'
        });

        const replyData = {status: 'SUCCESS'};

        nock('http://localhost')
            .post('/api')
            .reply(200, replyData);

        return validatorAsync('test me', {})
        .then(({status}) => {
            expect(status).to.equal(replyData.status);
        })
        .catch((message) => {
            assert.ok(false);
        });
    });

    it('should throw and error if validator not a function', () => {
        expect(() => validator.registerValidator('test', null)).to.throw();
    });

    it('should add depended fields into depended rule names', () => {
        expect(dependedRuleNames).to.not.include.members(['testDepend']);
        validator.registerValidator('testDepend', () => {}, 'field2');
        expect(dependedRuleNames).to.include.members(['testDepend']);
    });
});
