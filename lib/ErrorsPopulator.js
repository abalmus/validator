"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var ErrorsPopulator = /** @class */ (function () {
    function ErrorsPopulator(validationProcessor) {
        this.validationProcessor = validationProcessor;
        this.validationProcessor = validationProcessor;
    }
    ErrorsPopulator.prototype.errorConverter = function (errors) {
        var convertedErrors = [];
        lodash_1.keys(errors).map(function (key) {
            convertedErrors.push((_a = {}, _a[errors[key].ruleName] = errors[key].reason, _a));
            var _a;
        });
        return convertedErrors;
    };
    ErrorsPopulator.prototype.getByField = function (fieldName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (lodash_1.first(lodash_1.keys(_this.validationProcessor.asyncProcessorQueue.process(fieldName)))) {
                return Promise.all(lodash_1.values(_this.validationProcessor.asyncProcessorQueue.process(fieldName)))
                    .then(function (result) { console.log(result); })
                    .catch(function (resultedReason) {
                    var _a = JSON.parse(resultedReason.message), ruleName = _a.ruleName, reason = _a.reason;
                    var syncError = {};
                    syncError[fieldName + '__' + ruleName] = { fieldName: fieldName, ruleName: ruleName, reason: reason };
                    resolve(_this.errorConverter(Object.assign({}, _this.validationProcessor.processorQueue.process(fieldName), syncError)));
                });
            }
            else {
                resolve(_this.errorConverter(Object.assign({}, _this.validationProcessor.processorQueue.process(fieldName))));
            }
        });
    };
    return ErrorsPopulator;
}());
exports.ErrorsPopulator = ErrorsPopulator;
//# sourceMappingURL=ErrorsPopulator.js.map