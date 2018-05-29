import { pickBy, startsWith, omit } from 'lodash';
import { generateProcessId } from './utils';

interface Process {
    message: any;
}

export class ProcessorQueue {
    queue: object;

    constructor(queue) {
        this.queue = queue;
    }

    public clean(fieldName: string, ruleName: string) {
        this.queue = omit(this.queue, [`${fieldName}__${ruleName}`]);
    }

    public process(fieldName: string, ruleName: string = '', process?: any): any {
        const processId = generateProcessId(fieldName, ruleName);

        if (typeof process === 'undefined') {
            return pickBy(this.queue, (value, key) => {
                return startsWith(key, processId);
            });
        }

        return this.queue[processId] = { fieldName, ruleName, reason: process.message };
    }
};

export const processorQueue = new ProcessorQueue({});
