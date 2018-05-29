"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validators_1 = require("./validators");
var ValidationRules_1 = require("./ValidationRules");
var Validator = /** @class */ (function () {
    function Validator(validatorsSrc) {
        this.validatorsSrc = validatorsSrc;
        this.validators = validatorsSrc;
    }
    Validator.prototype.invokeValidator = function (ruleName, ruleValue) {
        var _this = this;
        return function (value, formState) {
            var validator = _this.validators[ruleName.toLowerCase()];
            if (validator && typeof validator === 'function') {
                return _this.validators[ruleName.toLowerCase()](value, ruleValue, formState);
            }
            throw new Error("Missing validator, please register validator \"" + ruleName.toLowerCase() + "\"");
        };
    };
    Validator.prototype.registerValidator = function (ruleName, validator, dependsOnFieldValue) {
        if (typeof validator !== 'function') {
            throw new Error(ruleName + ' Validator is not a function');
        }
        if (dependsOnFieldValue) {
            ValidationRules_1.dependedRuleNames.push(ruleName);
        }
        this.validators[ruleName.toLowerCase()] = validator;
    };
    return Validator;
}());
exports.Validator = Validator;
exports.validator = new Validator(validators_1.validators);
//# sourceMappingURL=Validator.js.map