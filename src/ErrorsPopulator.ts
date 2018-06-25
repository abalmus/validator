import { Validation } from './ValidationProcessor';
import { keys, values, first, filter } from 'lodash';

interface ErrorsPopulatorI {
    getByField(fieldName: string): Promise<any>;
}

export class ErrorsPopulator implements ErrorsPopulatorI {
    constructor(private validationProcessor: Validation.ValidationProcessor) {
        this.validationProcessor = validationProcessor;
    }

    public errorConverter(errors: any[]) {
        const convertedErrors = [];

        keys(errors).map(key => {
            convertedErrors.push({[errors[key].ruleName]: errors[key].reason} );
        });

        return convertedErrors;
    }

    public getAll(fieldNames: string[]) {
        const errors = [];

        fieldNames.length && fieldNames.map(fieldName => {
            errors.push(
                this.errorConverter(
                    Object.assign({}, this.validationProcessor.processorQueue.process(fieldName)),
                )
            );
        })
    }

    public getByField(fieldName: string) {
        return new Promise((resolve, reject) => {
            if (first(keys(this.validationProcessor.asyncProcessorQueue.process(fieldName)))) {
                return Promise.all(values(this.validationProcessor.asyncProcessorQueue.process(fieldName)))
                    .then((result) => {console.log(result);})
                    .catch((resultedReason) => {
                        const { ruleName, reason } = JSON.parse(resultedReason.message);
                        const syncError = {};

                        syncError[fieldName + '__' + ruleName] = { fieldName, ruleName, reason };

                        resolve(
                            this.errorConverter(
                                Object.assign(
                                    {},
                                    this.validationProcessor.processorQueue.process(fieldName),
                                    syncError
                                ),
                            ),
                        );
                    });
            } else {
                resolve(
                    this.errorConverter(
                        Object.assign({}, this.validationProcessor.processorQueue.process(fieldName)),
                    ),
                );
            }
        });
    }
}
