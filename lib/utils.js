"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function generateProcessId(fieldName, ruleName) {
    return fieldName + "__" + ruleName;
}
exports.generateProcessId = generateProcessId;
function isPromise(obj) {
    return !!obj && lodash_1.isFunction(obj.then);
}
exports.isPromise = isPromise;
