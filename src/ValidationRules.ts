import { validator } from './ValidatorFactory';
import {
    keys,
    forEach,
    isFunction,
    has,
    forIn,
    map
} from 'lodash';

export namespace Interface {
    export interface ValidationRules {
        rules: any;
        messages: any;
    }
}

export const dependedRuleNames = ['dependsOn'];

export class ValidationRules implements Interface.ValidationRules {
    rules: any = {};
    messages: any = {};

    constructor(validationRules) {
        if (!validationRules.rules) { return; }

        forEach(keys(validationRules.rules), ((ruleName) => {
            this.rules[ruleName] = validator.invokeValidator(ruleName, validationRules.rules[ruleName]);
        }).bind(this));
    }

    public get() {
        return this.rules;
    }
}

export function detectDependsOn(rules, fieldNameToValidate, value) {
    let validationRulesToApply = { };

    forIn(rules, (constrains, fieldName) => {
        map(dependedRuleNames, ruleName => {
            if (has(constrains, ruleName + '.' + fieldNameToValidate)) {
                const validationRules = constrains[ruleName][fieldNameToValidate][value];

                validationRulesToApply[fieldName] =  constrains[ruleName][fieldNameToValidate][value] ||
                    constrains[ruleName][fieldNameToValidate].DEFAULT;
            }
        });
    });

    return validationRulesToApply;
}

export function initialDependsOnDetection(rules, dependsOnValues: any) {
    const validationRulesToApply = { };

    forIn(rules, (constrains, fieldName) => {
        map(dependedRuleNames, ruleName => {
            if (has(constrains, ruleName)) {
                forIn(constrains[ruleName], (rules, dependsOnFieldName: string) => {
                    validationRulesToApply[fieldName] = rules[dependsOnValues[dependsOnFieldName]] || rules.DEFAULT;
                });
            }
        });
    });

    return validationRulesToApply;
};
