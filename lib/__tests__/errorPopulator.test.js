"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationProcessor_1 = require("../ValidationProcessor");
var ErrorsPopulator_1 = require("../ErrorsPopulator");
var chai_1 = require("chai");
var testData_1 = require("./testData");
require("mocha");
var validationProcessor = new ValidationProcessor_1.ValidationProcessor(testData_1.testValidationRules, {
    dependsOnValues: {},
});
var errorsPopulator = new ErrorsPopulator_1.ErrorsPopulator(validationProcessor);
describe('Error Populator', function () {
    it('should extract errors from processor queue', function () {
        var fieldName = 'field2';
        validationProcessor.validate(fieldName, '12');
        return errorsPopulator.getByField(fieldName).then(function (errors) {
            chai_1.expect(errors).to.deep.include({ minlength: 'Please enter min 10 characters' });
            chai_1.expect(errors).to.deep.include({ async: {} });
        });
    });
    it('should remove errors if field valid', function () {
        var fieldName = 'field2';
        validationProcessor.validate(fieldName, '1234567890');
        return errorsPopulator.getByField(fieldName).then(function (errors) {
            chai_1.expect(errors).to.not.deep.include({ minlength: 'Please enter min 10 characters' });
            chai_1.expect(errors).to.deep.include({ async: {} });
        });
    });
});
//# sourceMappingURL=errorPopulator.test.js.map