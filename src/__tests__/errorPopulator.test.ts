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

    it('should return errors for listed fields only', () => {
        validationProcessor.validate('field3', '12');
        validationProcessor.validate('field4', 'test');

        const errors = errorsPopulator.getAll(['field3', 'field4']);
        const errorsFiltered = errorsPopulator.getAll(['field3']);

        expect(errors).to.have.property('field3');
        expect(errors).to.have.property('field4');
        expect(errors['field3']).to.deep.include({ minlength: 'Please enter min 5 characters' });
        expect(errors['field4']).to.deep.include({ minlength: 'Please enter min 10 characters' });
        expect(errorsFiltered).to.have.property('field3');
        expect(errorsFiltered['field3']).to.deep.include({ minlength: 'Please enter min 5 characters' });
        expect(errorsFiltered).to.not.have.property('field4');
    });
});
