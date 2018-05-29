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
var ValidationProcessor_1 = require("./ValidationProcessor");
var ErrorsPopulator_1 = require("./ErrorsPopulator");
function ValidationDecorator(constructor) {
    return /** @class */ (function (_super) {
        __extends(Form, _super);
        function Form() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.validationProcessor = new ValidationProcessor_1.ValidationProcessor(_this.props.validationRules, {
                dependsOnValues: _this.formState,
            });
            _this.errorsPopulator = new ErrorsPopulator_1.ErrorsPopulator(_this.validationProcessor);
            return _this;
        }
        Form.prototype.validateField = function (fieldName, value) {
            var _this = this;
            this.validationProcessor.validate(fieldName, value);
            return this.errorsPopulator.getByField(fieldName).then(function (errors) {
                _this.populateErrors(errors, fieldName);
            });
        };
        Form.prototype.validateForm = function (cb) {
            var _this = this;
            var fieldsToValidate = [];
            for (var key in this.formState) {
                fieldsToValidate.push(this.validateField(key, this.formState[key]));
            }
            ;
            Promise.all(fieldsToValidate).then(function () {
                var errors = _this.state.errors;
                cb.call(_this, errors);
            });
        };
        Form.prototype.populateErrors = function (errors, fieldName) {
            this.setState(function (prevState) {
                return ErrorsPopulator_1.normalizeErrors(prevState, errors, fieldName);
            });
        };
        return Form;
    }(constructor));
}
exports.ValidationDecorator = ValidationDecorator;
//# sourceMappingURL=ValidationDecorator.js.map