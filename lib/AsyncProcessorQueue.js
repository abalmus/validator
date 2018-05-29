"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ProcessorQueue_1 = require("./ProcessorQueue");
var lodash_1 = require("lodash");
var utils_1 = require("./utils");
var AsyncProcessorQueue = /** @class */ (function (_super) {
    __extends(AsyncProcessorQueue, _super);
    function AsyncProcessorQueue(queue) {
        return _super.call(this, queue) || this;
    }
    AsyncProcessorQueue.prototype.process = function (fieldName, ruleName, process) {
        if (ruleName === void 0) { ruleName = ''; }
        var processId = utils_1.generateProcessId(fieldName, ruleName);
        if (typeof process === 'undefined') {
            return lodash_1.pickBy(this.queue, function (value, key) {
                return lodash_1.startsWith(key, processId);
            });
        }
        return this.queue[processId] = this.processResolver(fieldName, ruleName, process);
    };
    AsyncProcessorQueue.prototype.processResolver = function (fieldName, ruleName, process) {
        var _this = this;
        var processId = utils_1.generateProcessId(fieldName, ruleName);
        return process.then(function () {
            delete _this.queue[processId];
        }, function (reason) {
            throw new Error(JSON.stringify({ fieldName: fieldName, ruleName: ruleName, reason: reason }));
        });
    };
    return AsyncProcessorQueue;
}(ProcessorQueue_1.ProcessorQueue));
exports.AsyncProcessorQueue = AsyncProcessorQueue;
;
exports.asyncProcessorQueue = new AsyncProcessorQueue({});
//# sourceMappingURL=AsyncProcessorQueue.js.map