"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validators_1 = require("./validators");
var ValidationRules_1 = require("./ValidationRules");
var ValidatorFactory = /** @class */ (function () {
    function ValidatorFactory(validatorsSrc) {
        this.validatorsSrc = validatorsSrc;
        this.validators = validatorsSrc;
    }
    ValidatorFactory.prototype.invokeValidator = function (ruleName, ruleValue) {
        var _this = this;
        return function (value, dependsOnValues) {
            var validator = _this.validators[ruleName.toLowerCase()];
            if (validator && typeof validator === 'function') {
                return _this.validators[ruleName.toLowerCase()](value, ruleValue, dependsOnValues);
            }
            throw new Error("Missing validator, please register validator \"" + ruleName.toLowerCase() + "\"");
        };
    };
    ValidatorFactory.prototype.registerValidator = function (ruleName, validator, dependsOnFieldValue) {
        if (typeof validator !== 'function') {
            throw new Error(ruleName + ' Validator is not a function');
        }
        if (dependsOnFieldValue) {
            ValidationRules_1.dependedRuleNames.push(ruleName);
        }
        this.validators[ruleName.toLowerCase()] = validator;
    };
    return ValidatorFactory;
}());
exports.ValidatorFactory = ValidatorFactory;
exports.validator = new ValidatorFactory(validators_1.validators);
//# sourceMappingURL=ValidatorFactory.js.map