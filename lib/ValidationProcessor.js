"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AsyncProcessorQueue_1 = require("./AsyncProcessorQueue");
var ProcessorQueue_1 = require("./ProcessorQueue");
var lodash_1 = require("lodash");
var utils_1 = require("./utils");
var ValidationRules_1 = require("./ValidationRules");
var ValidationProcessor = /** @class */ (function () {
    /* end-test-code */
    function ValidationProcessor(constraints, config) {
        this.constraints = constraints;
        this.processedConstraints = {};
        this.disabledValidationFields = {};
        /* test-code */
        this.__testApi = {
            context: this,
            processedConstraints: this.processedConstraints,
            constraints: this.constraints,
        };
        var rules = (this.constraints = constraints).rules;
        this.asyncProcessorQueue = new AsyncProcessorQueue_1.AsyncProcessorQueue({});
        this.processorQueue = new ProcessorQueue_1.ProcessorQueue({});
        if (config && config.dependsOnValues) {
            this.setDependsOnValues(config.dependsOnValues, rules);
        }
    }
    ValidationProcessor.prototype.validate = function (fieldName, value, dependsOnValues) {
        var _this = this;
        var rules = this.constraints.rules;
        dependsOnValues && lodash_1.isObject(dependsOnValues) && this.setDependsOnValues(dependsOnValues, rules);
        var processors = this.getFieldSpecificProcessor(fieldName).get();
        var messages = this.filterConstraintsByFieldName(fieldName).messages;
        lodash_1.forIn(ValidationRules_1.detectDependsOn(rules, fieldName, value), function (constrains, fieldName) {
            _this.applyRules(constrains, fieldName);
        });
        lodash_1.forEach(lodash_1.keys(processors), (function (ruleName) {
            var process = processors[ruleName](value);
            var message = messages[ruleName];
            _this.processorQueue.clean(fieldName, ruleName);
            _this.asyncProcessorQueue.clean(fieldName, ruleName);
            if (utils_1.isPromise(process)) {
                _this.asyncProcessorQueue.process(fieldName, ruleName, process);
            }
            if (!process) {
                _this.processorQueue.process(fieldName, ruleName, { message: message });
            }
        }).bind(this));
        return {
            debug: function () { return ({ processors: processors, messages: messages, constraints: _this.constraints }); }
        };
    };
    ValidationProcessor.prototype.disableFieldValidation = function (fieldName) {
        this.disabledValidationFields[fieldName] = true;
    };
    ValidationProcessor.prototype.enableFieldValidation = function (fieldName) {
        delete this.disabledValidationFields[fieldName];
    };
    ValidationProcessor.prototype.isDisabled = function (fieldName) {
        return Boolean(this.disabledValidationFields[fieldName]);
    };
    ValidationProcessor.prototype.setDependsOnValues = function (dependsOnValues, rules) {
        var _this = this;
        if (dependsOnValues) {
            var validationRulesToApply = ValidationRules_1.initialDependsOnDetection(rules, dependsOnValues);
            lodash_1.forIn(validationRulesToApply, function (constrains, fieldName) {
                _this.applyRules(constrains, fieldName);
            });
        }
    };
    ValidationProcessor.prototype.applyRules = function (constrains, fieldName) {
        var newRules = Object.assign({}, this.constraints.rules[fieldName], constrains.rules);
        var newMessages = Object.assign({}, this.constraints.messages[fieldName], constrains.messages);
        this.constraints.rules[fieldName] = newRules;
        this.constraints.messages[fieldName] = newMessages;
        this.cleanRules(fieldName);
    };
    ValidationProcessor.prototype.cleanRules = function (fieldName) {
        delete this.processedConstraints[fieldName];
    };
    ValidationProcessor.prototype.getFieldSpecificProcessor = function (fieldName) {
        if (!this.processedConstraints[fieldName]) {
            this.processedConstraints = __assign({}, this.processedConstraints, (_a = {}, _a[fieldName] = new ValidationRules_1.ValidationRules(this.filterConstraintsByFieldName(fieldName)), _a));
        }
        return this.processedConstraints[fieldName];
        var _a;
    };
    ValidationProcessor.prototype.filterConstraintsByFieldName = function (fieldName) {
        if (this.constraints.messages && this.constraints.rules) {
            return {
                messages: this.constraints.messages[fieldName],
                rules: this.constraints.rules[fieldName],
            };
        }
        return {
            messages: null,
            rules: null
        };
    };
    return ValidationProcessor;
}());
exports.ValidationProcessor = ValidationProcessor;
