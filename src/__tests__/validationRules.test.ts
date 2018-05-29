import { ValidationRules } from '../ValidationRules';
import { expect, assert } from 'chai';

import 'mocha';

describe('ValidationRules', () => {
    it('should create validators', () => {
        const constraints = new ValidationRules({
            rules: {
                minlength: 5
            },
            messages: {
                minlength: 'Insert min 5 characters'
            }
        });

        expect(constraints.rules).to.have.property('minlength');
        expect(constraints.rules.minlength).to.be.a('function');
    });

    it('should return empty object if no rules provided', () => {
        const constraints = new ValidationRules({});

        expect(constraints.rules).to.be.an('object');
    });
});
