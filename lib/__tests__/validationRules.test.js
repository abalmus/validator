"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationRules_1 = require("../ValidationRules");
var chai_1 = require("chai");
require("mocha");
describe('ValidationRules', function () {
    it('should create validators', function () {
        var constraints = new ValidationRules_1.ValidationRules({
            rules: {
                minlength: 5
            },
            messages: {
                minlength: 'Insert min 5 characters'
            }
        });
        chai_1.expect(constraints.rules).to.have.property('minlength');
        chai_1.expect(constraints.rules.minlength).to.be.a('function');
    });
    it('should return empty object if no rules provided', function () {
        var constraints = new ValidationRules_1.ValidationRules({});
        chai_1.expect(constraints.rules).to.be.an('object');
    });
});
//# sourceMappingURL=validationRules.test.js.map