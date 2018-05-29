import { ValidationProcessor } from '../ValidationProcessor';
import { ErrorsPopulator } from '../ErrorsPopulator';
import { expect, assert } from 'chai';
import { testValidationRules } from './testData';

import 'mocha';

const validationProcessor = new ValidationProcessor(testValidationRules, {
    dependsOnValues: {},
});

const errorsPopulator = new ErrorsPopulator(validationProcessor);

describe('Error Populator', () => {
    it('should extract errors from processor queue', () => {
        const fieldName = 'field2';

        validationProcessor.validate(fieldName, '12');

        return errorsPopulator.getByField(fieldName).then((errors) => {
            expect(errors).to.deep.include({ minlength: 'Please enter min 10 characters' });
            expect(errors).to.deep.include({ async: {} });
        });
    });

    it('should remove errors if field valid', () => {
        const fieldName = 'field2';

        validationProcessor.validate(fieldName, '1234567890');

        return errorsPopulator.getByField(fieldName).then((errors) => {
            expect(errors).to.not.deep.include({ minlength: 'Please enter min 10 characters' });
            expect(errors).to.deep.include({ async: {} });
        });
    });
});
