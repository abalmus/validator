import { asyncProcessorQueue } from './../AsyncProcessorQueue';
import { ValidationProcessor } from '../ValidationProcessor';
import { expect, assert } from 'chai';
import { testValidationRules } from './testData';

import 'mocha';

let dependsOnValues = {
    field2: ''
};

const validationProcessor = new ValidationProcessor(testValidationRules, {
    dependsOnValues
});

function waitAsyncValidation() {
    const formatedQueueKey = 'field2__async';

    const {
        queue,
    } = validationProcessor.asyncProcessorQueue;

    return new Promise((resolve) => {
        queue[formatedQueueKey] && queue[formatedQueueKey].catch(() => {
            assert.ok(true);
            resolve();
        });
        resolve();
    });
}

describe('ValidationProcessor', () => {
    it('should have validate() method', () => {
        expect(validationProcessor.validate).to.be.a('function');
        return waitAsyncValidation();
    });

    it('should set default validation rules if no value provided', () => {
        const {
            minlength,
            maxlength,
        } = extractMinMaxLength();

        expect(Number(minlength)).to.be.equal(1);
        expect(Number(maxlength)).to.be.equal(11);

        return waitAsyncValidation();
    });

    it('should detect depends on fields', () => {
        dependsOnValues.field2 = 'DE';
        validationProcessor.validate('field2', 'DE');

        const {
            minlength,
            maxlength,
        } = extractMinMaxLength();

        expect(Number(minlength)).to.be.equal(9);
        expect(Number(maxlength)).to.be.equal(99);

        return waitAsyncValidation();
    });

    it('should replace depends on validation rules if country changed', () => {
        dependsOnValues.field2 = 'GB';
        validationProcessor.validate('field2', 'GB');

        const {
            minlength,
            maxlength,
        } = extractMinMaxLength();

        expect(Number(minlength)).to.be.equal(8);
        expect(Number(maxlength)).to.be.equal(88);

        return waitAsyncValidation();
    });

    it('should add validation process to the processor queue', () => {
        validationProcessor.validate('field2', 'GB');

        const {
            queue,
        } = validationProcessor.processorQueue;

        expect(queue).to.have.property('field2__minlength');

        return waitAsyncValidation();
    });

    it('should add async validation process to the async processor queue', () => {
        validationProcessor.validate('field2', 'GB');

        const formatedQueueKey = 'field2__async';

        const {
            queue,
        } = validationProcessor.asyncProcessorQueue;

        expect(queue).to.have.property(formatedQueueKey);

        return waitAsyncValidation();
    });

    it('should convert validation rules to processors', () => {
        validationProcessor.validate('field2', 'GB');

        const formatedQueueKey = 'field2__async';

        const {
            field2: {
                rules: {
                    async,
                    minlength,
                }
            }
        } = validationProcessor.__testApi.context.processedConstraints;

        expect(async).to.be.a('function');
        expect(minlength).to.be.a('function');

        return waitAsyncValidation();
    });

    it('should return current process if new process not provided', () => {
        const {
            asyncProcessorQueue,
            processorQueue
        } = validationProcessor.__testApi.context;

        const formatedQueueKey = 'field2__minlength';
        const asyncFormatedQueueKey = 'field2__async';

        expect(asyncProcessorQueue.process('field2', 'async')).to.have.property(asyncFormatedQueueKey);
        expect(processorQueue.process('field2', 'minlength')).to.have.property(formatedQueueKey);

        return waitAsyncValidation();
    });

    it('should be able to apply depends on values during validation', () => {
        const resultForDE = validationProcessor.validate('field1', 'text', { field2: 'DE' }).debug();
        expect(resultForDE.constraints.rules.field1.minlength).to.equal(9);
        expect(resultForDE.constraints.rules.field1.maxlength).to.equal(99);

        const resultForGB = validationProcessor.validate('field1', 'text', { field2: 'GB' }).debug();
        expect(resultForGB.constraints.rules.field1.minlength).to.equal(8);
        expect(resultForGB.constraints.rules.field1.maxlength).to.equal(88);
    });

    it('should have public resulted api', () => {
        const result = validationProcessor.validate('field1', 'text');

        expect(result.debug).to.be.a('function');
    });
});

function extractMinMaxLength() {
    const {
        constraints: {
            rules: {
                field1: {
                    minlength,
                    maxlength,
                }
            }
        }
    } = validationProcessor.__testApi;

    return {
        minlength,
        maxlength,
    }
}
