import { validators as defaultValidators } from './validators';
import { dependedRuleNames } from './ValidationRules';

export class ValidatorFactory {
    validators: any;

    constructor(private validatorsSrc) {
        this.validators = validatorsSrc
    }

    public invokeValidator(ruleName: string, ruleValue: any) {
        return (value: string | number, dependsOnValues: object) => {
            const validator = this.validators[ruleName.toLowerCase()];
            if (validator && typeof validator === 'function') {
                return this.validators[ruleName.toLowerCase()](value, ruleValue, dependsOnValues);
            }

            throw new Error(`Missing validator, please register validator "${ruleName.toLowerCase()}"`);
        };
    }

    public registerValidator(ruleName: string, validator, dependsOnFieldValue?: string) {
        if (typeof validator !== 'function') {
            throw new Error(ruleName + ' Validator is not a function');
        }

        if (dependsOnFieldValue) {
            dependedRuleNames.push(ruleName);
        }

        this.validators[ruleName.toLowerCase()] = validator;
    }
}

export const validator = new ValidatorFactory(defaultValidators);
