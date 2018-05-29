import { isFunction } from 'lodash';

export function generateProcessId(fieldName: string, ruleName: string): string {
    return `${fieldName}__${ruleName}`;
}

export function isPromise(obj) { // TODO to utils
    return !!obj && isFunction(obj.then);
}
