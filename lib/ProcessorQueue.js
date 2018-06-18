"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var utils_1 = require("./utils");
var ProcessorQueue = /** @class */ (function () {
    function ProcessorQueue(queue) {
        this.queue = queue;
    }
    ProcessorQueue.prototype.clean = function (fieldName, ruleName) {
        this.queue = lodash_1.omit(this.queue, [fieldName + "__" + ruleName]);
    };
    ProcessorQueue.prototype.process = function (fieldName, ruleName, process) {
        if (ruleName === void 0) { ruleName = ''; }
        var processId = utils_1.generateProcessId(fieldName, ruleName);
        if (typeof process === 'undefined') {
            return lodash_1.pickBy(this.queue, function (value, key) {
                return lodash_1.startsWith(key, processId);
            });
        }
        return this.queue[processId] = { fieldName: fieldName, ruleName: ruleName, reason: process.message };
    };
    return ProcessorQueue;
}());
exports.ProcessorQueue = ProcessorQueue;
;
exports.processorQueue = new ProcessorQueue({});
