# Validation Processor

## **Description**

**ValidationProcessor** - low-level asynchronous validation engine. Designed for testing data, based on validation rules. Can be easily extended with custom validators. Compatible with any modern frameworks or VanillaJS.

## Installation

```javascript
// NPM
npm install @tacitknowledge/validator

// YARN
yarn add @tacitknowledge/validator
```

# Usage

### Validation processor initialization

```javascript
import { ValidationProcessor } from '@tacitknowledge/validator';

const constrains = {
  rules: {
    firstName: {
      minlength: 10
    }
  },
  messages: {
    firstName: {
      minlength: 'First name needs to be not less than 10 characters'
    }
  }
};
/*
	* ValidateProcessor constructor
	* params: ( constrains, [options] )
	* returns: instance of the validation processor
	*/
const validationProcessor = new ValidationProcessor(constrains);
/*
	* validate
	* params: ( fieldName, value, [options] )
	* returns: undefined
	*/
validationProcessor.validate('firstName', 'myname');
```

### Getting validation errors
The easiest way of getting errors from validation processor is using ErrorPopulator.

```javascript
import { ErrorsPopulator } from '@abalmus/validator';
/*
	* ErrorPopulator constructor
	* params: ( validationProcessorInstance, [options] )
	* returns: errors populator instance
	*/
const errors = new ErrorsPopulator(validationProcessor);

/*
	* getByField emthod
	* params: ( fieldName, [options] )
	* returns: Promise
	*/
errors.getByField('firstName').then((errors) => console.log(errors));
// [{minlength: "First name needs to be not less than 10 characters"}]
```
# Validators
## Build in Validators

```javascript
    const constrains = {
        rules: {
            firstName: {
                minLength: 4,
                maxLength: 10,
                required: true,
                equal: 'John',
                pattern: /^[a-zA-Z ]+$/
            }
        },
        messages: {
            firstName: {
                minLength: 'Please insert minimum 4 characters',
                maxLength: 'Please insert maximum 10 characters',
                required: 'Please insert first name',
                equal: 'Please insert correct name',
                pattern: 'Only letters allowed'
            }
        }
    }
```
### "maxLength" and "minLength"
`minLength` and `maxLength` each of these validators convert any value to a string and checks length property.

### "equal" validator
Simple equality check, comparing value and type.

### "pattern" validator
JavaScript Regexp test method executes a search for a match between a regular expression provided in `pattern` property and a specified string.

### "async" validator
Async validator created for server side validations. The example email address existence, when you make an ajax call to check if email exists or not.

```javascript
    const constrains = {
        rules: {
            email: {
                async: {
                    url: 'api/email/exist',
                    // ...other fetch API options
                }
            }
        },
        messages: {
            email: {
                async: 'Email already exists.'
            }
        }
    }
```

Default server side response format:

```javascript
    {
        status: 'ERROR', // ['SUCCESS', 'ERROR', 'INFO']
        message: 'Server message goes here' // will be rendered below the field
    }
```

## Custom Validators
The most important part of this library is a creation of custom validators. This is powerful mechanism of extending validation processor. To register validator lets call `validator.registerValidator` method.

```javascript
    import {
        validator,
        ValidationProcessor
    } from '@tacitknowledge/validator';

    validator.registerValidator('moreOrEqual', (value, ruleValue) => {
        return (Number(value) >= Number(ruleValue));
    });
```

Now we can use `moreOrEqual` validator inside constrains.

```javascript
    const constrains = {
        rules: {
            age: {
                moreOrEqual: 16
            }
        },
        messages: {
            age: {
                moreOrEqual: 'You needs to be at least 16 years old'
            }
        }
    }

    const validationProcessor = new ValidationProcessor(constrains);

    validationProcessor.validate('age', 18); // Valid!

```

## "dependsOn" rule wrapper

One more powerful and useful mechanism is `dependsOn` rules wrapper. This wrapper allows to apply validation rules depends on other values.

The example phone pattern for Germany is different than in the United States.

```javascript
    const constrains = {
        rules: {
            phoneNumber: {
                dependsOn: {
                    country: {
                        US: {
                            rules: {
                                pattern: // US phone number regex
                                minLength: 10
                            }
                        },
                        DE: {
                            rules: {
                                pattern: // DE phone number regex
                                minLength: 8
                            }
                        }
                    }
                }
            }
        }
    };
```

As you can see there are nested dependsOn wrapper and rules. The rules inside the country automatically applied based on country value.

### How to use:

Option 1: Passing `dependsOnValues` to ValidationProcessor config on initialization phase

```javascript

const validationProcessor = new ValidationProcessor(constrains, {
    dependsOnValues: {
        country: 'US'
    }
});

validationProcessor.validate('phoneNumber', '123456787') // not valid

```

Option 2: Passing `dependsOnValues` as a third parameter of the `validate` method

```javascript

const validationProcessor = new ValidationProcessor(constrains);

validationProcessor.validate('phoneNumber', '123456787', { country: 'US' }) // not valid

```
