import { ProcessorQueue } from './ProcessorQueue';
import { pickBy, startsWith } from 'lodash';
import { generateProcessId } from './utils';

export class AsyncProcessorQueue extends ProcessorQueue {
    queue: object;

    constructor(queue) {
        super(queue);
    }

    public process(fieldName: string, ruleName: string = '', process?: Promise<any>): any {
        const processId = generateProcessId(fieldName, ruleName);

        if (typeof process === 'undefined') {
            return pickBy(this.queue, (value, key) => {
                return startsWith(key, processId);
            });
        }

        return this.queue[processId] = this.processResolver(fieldName, ruleName, process);
    }

    private processResolver(fieldName: string, ruleName: string, process: Promise<any>) {
        const processId = generateProcessId(fieldName, ruleName);

        return process.then(() => {
            delete this.queue[processId];
        }, reason => {
            throw new Error(JSON.stringify({ fieldName, ruleName, reason }));
        });
    }
};

export const asyncProcessorQueue = new AsyncProcessorQueue({});
