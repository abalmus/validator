"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidatorFactory_1 = require("./ValidatorFactory");
var lodash_1 = require("lodash");
exports.dependedRuleNames = ['dependsOn'];
var ValidationRules = /** @class */ (function () {
    function ValidationRules(validationRules) {
        var _this = this;
        this.rules = {};
        this.messages = {};
        if (!validationRules.rules) {
            return;
        }
        lodash_1.forEach(lodash_1.keys(validationRules.rules), (function (ruleName) {
            _this.rules[ruleName] = ValidatorFactory_1.validator.invokeValidator(ruleName, validationRules.rules[ruleName]);
        }).bind(this));
    }
    ValidationRules.prototype.get = function () {
        return this.rules;
    };
    return ValidationRules;
}());
exports.ValidationRules = ValidationRules;
function detectDependsOn(rules, fieldNameToValidate, value) {
    var validationRulesToApply = {};
    lodash_1.forIn(rules, function (constrains, fieldName) {
        lodash_1.map(exports.dependedRuleNames, function (ruleName) {
            if (lodash_1.has(constrains, ruleName + '.' + fieldNameToValidate)) {
                var validationRules = constrains[ruleName][fieldNameToValidate][value];
                validationRulesToApply[fieldName] = constrains[ruleName][fieldNameToValidate][value] ||
                    constrains[ruleName][fieldNameToValidate].DEFAULT;
            }
        });
    });
    return validationRulesToApply;
}
exports.detectDependsOn = detectDependsOn;
function initialDependsOnDetection(rules, dependsOnValues) {
    var validationRulesToApply = {};
    lodash_1.forIn(rules, function (constrains, fieldName) {
        lodash_1.map(exports.dependedRuleNames, function (ruleName) {
            if (lodash_1.has(constrains, ruleName)) {
                lodash_1.forIn(constrains[ruleName], function (rules, dependsOnFieldName) {
                    validationRulesToApply[fieldName] = rules[dependsOnValues[dependsOnFieldName]] || rules.DEFAULT;
                });
            }
        });
    });
    return validationRulesToApply;
}
exports.initialDependsOnDetection = initialDependsOnDetection;
;
