import { AsyncProcessorQueue } from './AsyncProcessorQueue';
import { ProcessorQueue } from './ProcessorQueue';

import { keys, forEach, isFunction, forIn, isObject } from 'lodash';
import { isPromise } from './utils';

import {
    ValidationRules,
    initialDependsOnDetection,
    dependedRuleNames,
    detectDependsOn
} from './ValidationRules';

export namespace Validation {
    export interface ValidationRules {
        rules: any;
        messages: any;
    }

    export interface ValidationProcessor {
        asyncProcessorQueue: AsyncProcessorQueue;
        processedConstraints: any;
        processorQueue: ProcessorQueue;
        validate(ruleHolderName: string, value: any): any;
    }

    export interface ProcessorConfig {
        dependsOnFields?: string[];
        ruleMap?: string[];
        dependsOnValues: any;
    }
}

export class ValidationProcessor implements Validation.ValidationProcessor {
    processedConstraints: any = {};
    asyncProcessorQueue: AsyncProcessorQueue;
    processorQueue: ProcessorQueue;

    /* test-code */
    __testApi = {
        context: this,
        processedConstraints: this.processedConstraints,
        constraints: this.constraints,
    };
    /* end-test-code */

    constructor(private constraints: Validation.ValidationRules, config: Validation.ProcessorConfig) {
        const {rules} = this.constraints = constraints;

        this.asyncProcessorQueue = new AsyncProcessorQueue({});
        this.processorQueue = new ProcessorQueue({});

        if (config && config.dependsOnValues) {
            this.setDependsOnValues(config.dependsOnValues as Validation.ValidationRules, rules);
        }
    }

    validate(fieldName: string, value: any, dependsOnValues?: object): any { // check error type
        const { rules } = this.constraints;

        dependsOnValues && isObject(dependsOnValues) && this.setDependsOnValues(dependsOnValues, rules);

        const processors = this.getFieldSpecificProcessor(fieldName).get();
        const messages = this.filterConstraintsByFieldName(fieldName).messages;

        forIn(detectDependsOn(rules, fieldName, value), (constrains, fieldName) => {
            this.applyRules(constrains as Validation.ValidationRules, fieldName);
        });

        forEach(keys(processors), ((ruleName) => {
            const process = processors[ruleName](value);
            const message = messages[ruleName];

            this.processorQueue.clean(fieldName, ruleName);
            this.asyncProcessorQueue.clean(fieldName, ruleName);

            if (isPromise(process)) {
                this.asyncProcessorQueue.process(fieldName, ruleName, process);
            }

            if (!process) {
                this.processorQueue.process(fieldName, ruleName, {message});
            }
        }).bind(this));

        return {
            debug: () => ({ processors, messages, constraints: this.constraints})
        };
    }

    private setDependsOnValues(dependsOnValues, rules) {
        if (dependsOnValues) {
            const validationRulesToApply = initialDependsOnDetection(rules, dependsOnValues);

            forIn(validationRulesToApply, (constrains, fieldName) => {
                this.applyRules(constrains as Validation.ValidationRules, fieldName);
            });
        }
    }

    private applyRules(constrains: Validation.ValidationRules, fieldName): void {
        const newRules = Object.assign({}, this.constraints.rules[fieldName], constrains.rules);
        const newMessages = Object.assign({}, this.constraints.messages[fieldName], constrains.messages);

        this.constraints.rules[fieldName] = newRules;
        this.constraints.messages[fieldName] = newMessages;
        this.cleanRules(fieldName);
    }

    private cleanRules(fieldName: string): void {
        delete this.processedConstraints[fieldName];
    }

    private getFieldSpecificProcessor(fieldName: string) {
        if (!this.processedConstraints[fieldName]) {
            this.processedConstraints = {
                ...this.processedConstraints,
                [fieldName]: new ValidationRules(this.filterConstraintsByFieldName(fieldName)),
            };
        }

        return this.processedConstraints[fieldName];
    }

    private filterConstraintsByFieldName(fieldName: string): Validation.ValidationRules {
        return {
            messages: this.constraints.messages[fieldName],
            rules: this.constraints.rules[fieldName],
        };
    }
}
