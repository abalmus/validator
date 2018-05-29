"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testValidationRules = {
    rules: {
        'field1': {
            'dependsOn': {
                'field2': {
                    'GB': {
                        'rules': {
                            'minlength': 8,
                            'maxlength': 88
                        },
                        'messages': {
                            'minlength': 'Please enter min 8 characters',
                            'maxlength': 'Please enter max 88 characters'
                        }
                    },
                    'DE': {
                        'rules': {
                            'minlength': 9,
                            'maxlength': 99
                        },
                        'messages': {
                            'minlength': 'Please enter min 9 characters',
                            'maxlength': 'Please enter max 99 characters'
                        }
                    },
                    'DEFAULT': {
                        'rules': {
                            'minlength': 1,
                            'maxlength': 11
                        },
                        'messages': {
                            'minlength': 'Please enter min 1 characters',
                            'maxlength': 'Please enter max 11 characters'
                        }
                    }
                }
            }
        },
        'field2': {
            'async': {
                'url': 'some/url',
                'allowSubmitOnFail': 'true',
                'attempts': 2
            },
            'minlength': 10
        }
    },
    'messages': {
        'field2': {
            'async': 'Something went wrong',
            'minlength': 'Please enter min 10 characters'
        }
    }
};
//# sourceMappingURL=testData.js.map