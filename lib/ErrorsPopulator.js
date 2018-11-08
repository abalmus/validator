"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var ErrorsPopulator = /** @class */ (function () {
    function ErrorsPopulator(validationProcessor) {
        this.validationProcessor = validationProcessor;
        this.validationProcessor = validationProcessor;
    }
    ErrorsPopulator.prototype.errorConverter = function (errors) {
        var convertedErrors = {};
        lodash_1.keys(errors).map(function (key) {
            convertedErrors[errors[key].ruleName] = errors[key].reason;
        });
        return convertedErrors;
    };
    ErrorsPopulator.prototype.getAll = function (fieldNames) {
        var _this = this;
        var errors = {};
        fieldNames.length && fieldNames.map(function (fieldName) {
            if (!_this.validationProcessor.isDisabled(fieldName)) {
                errors[fieldName] = _this.errorConverter(Object.assign({}, _this.validationProcessor.processorQueue.process(fieldName)));
            }
        });
        return errors;
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
