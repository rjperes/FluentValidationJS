/**

FluentValidationJS
A fluent validation library for JavaScript
https://github.com/rjperes/FluentValidationJS
Copyright (c) Ricardo Peres 2016

 */

/**
 * Builds a new Validation object
 * @param {object} obj The object to validate
 */
function Validation(obj) {	
	this.obj = obj;
	this.negated = false;
	this.reporting(null);
	this.errors = [];
}

/**
 * Uses an exception to report validation errors
 */
Validation.ExceptionReporting = function(msg) {
	throw new Error(msg);
};

/**
 * Uses console.log to report validation errors
 */
Validation.ConsoleReporting = function(msg) {
	console.log(msg);
};

/**
 * Uses window.alert to report validation errors
 */
Validation.AlertReporting = function(msg) {
	window.alert(msg);
};

/**
 * Try to find the first argument of a given type
 * @param {array} args An array of arguments
 * @param {string} type The type to find
 * @returns {object} The first argument that matches the given type, or undefined
 */
function findFirstOfType(args, type) {
	for (var i = 0; i < args.length; ++i) {
		if (typeof args[i] === type) {
			return args[i];
		}
	}
	return undefined;
}

/**
 * Either returns the first argument as an array or the arguments implicit parameter
 * @param {array} args A possibly array parameter
 * @param {array} array An array of arguments
 * @returns {array} An array of arguments
 */
function getArguments(args, array) {
	var newArray = args;
	
	if (!(args instanceof Array)) {
		newArray = [ args ];
		for (var i = 1; i < array.length; ++i) {
			newArray.push(array[i]);
		}
	}
	
	return newArray;
}

/**
 * Calls the reporting function. For internal use only
 * @param {boolean} error An error flag
 * @param {string} msg An error message
 */
Validation.prototype.assert = function(error, msg) {
	if (error != this.negated) {
		this.errors.push(msg);
		this.report(msg);
	}
};

/**
 * Throws an exception if the validation failed
 */
Validation.prototype.throwOnError = function() {
	if (this.errors.length != 0) {
		Validation.ExceptionReporting(this.errors[0]);
	}	
};

/**
 * Returns the validation errors
 * @returns {array} An array with all the errors
 */
Validation.prototype.getErrors = function() {
	return this.errors;
};

/**
 * Checks if there are validation errors
 * @returns {boolean} An indication of whether there are errors or not
 */
Validation.prototype.hasErrors = function() {
	return this.errors.length != 0;	
};

/**
 * Checks if there are no validation errors
 * @returns {boolean} An indication of whether there are errors or not
 */
Validation.prototype.check = function() {
	return this.errors.length == 0;
};

/**
 * Clears all the errors
 * @returns {object} The Validation object
 */
Validation.prototype.clear = function() {
	this.errors = [];
	return this;
};

/**
 * Changes the reporting function in case of a validation error. The default is to throw an Error
 * @param {function} fn A reporting function
 * @returns {object} The Validation object
 */
Validation.prototype.reporting = function(fn) {
	if ((!fn) || (typeof fn !== 'function')) {
		fn = function(msg) {			
			Validation.ConsoleReporting(msg);
		};
	}
	
	this.report = fn;
	return this;
};

/**
 * Uses an external validation function
 * @param {function} fn A validation function
 * @param {string} msg An optional error message
 */
Validation.prototype.isValid = function(fn, msg) {
	var self = this;
	msg = msg || 'Validation failed: custom validation function';
	var error = (fn(self.obj) !== true);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is one of a set of passed values
 * @param {array} args An optional array of arguments
 */
Validation.prototype.isOneOf = function(args) {
	var self = this;
	var msg = 'Validation failed: objects do not match';
	var error = arguments.length > 0;
	args = getArguments(args, arguments);
	
	for (var i = 0; i < args.length; ++i) {
		if (self.obj == args[i]) {
			error = false;
			break;
		}
	}
	
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is not in a set of passed values
 * @param {array} args An optional array of arguments
 */
Validation.prototype.isNoneOf = function(args) {
	var self = this;
	var msg = 'Validation failed: objects do not match';
	var error = false;
	args = getArguments(args, arguments);
		
	for (var i = 0; i < args.length; ++i) {
		if (self.obj == args[i]) {
			error = true;
			break;
		}
	}
	
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate contains a supplied value
 * @param {object} value A value to find
 * @param {string} msg An optional error message
 */
Validation.prototype.contains = function(value, msg) {
	var self = this;
	msg = msg || 'Validation failed: object does not contain target';
	var error = self.obj.length != 0;
	
	for (var i = 0; i < self.obj.length; ++i) {
		if (self.obj[i] == value) {
			error = false;
			break;
		}
	}
	
	this.assert(error, msg);
	return this;	
};

/**
 * Checks if the value to validate is equal to a supplied value
 * @param {object} value A value to compare against
 * @param {object} arg1 An optional argument
 * @param {object} arg2 An optional argument
 */
Validation.prototype.isEqualTo = function(value, arg1, arg2) {
	var self = this;
	var caseInsensitive = findFirstOfType([arg1, arg2], 'boolean') || false;
	var msg = findFirstOfType([arg1, arg2], 'string') || 'Validation failed: objects do not match';
	var left = self.obj.toString();
	var right = value.toString();
			
	if (caseInsensitive) {
		left = left.toLowerCase();
		right = right.toLowerCase();
	}

	var error = (left != right);
	
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is a string
 * @param {string} msg An optional error message
 */
Validation.prototype.isString = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not a string';
	var error = ((typeof self.obj !== 'string') && (self.obj.toString() != obj));
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is neither null nor a whitespace string
 * @param {string} msg An optional error message
 */
Validation.prototype.isNotNullOrWhitespace = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is null or whitespace';
	var error = ((self.obj === null) || (self.obj.toString().trim().length == 0));
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is a number
 * @param {string} msg An optional error message
 */
Validation.prototype.isNumber = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not a number';
	var error = ((typeof self.obj !== 'number') && (Number(self.obj) != self.obj));
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is a positive number
 * @param {string} msg An optional error message
 */
Validation.prototype.isPositive = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not a number';
	var error = (Number(self.obj) <= 0);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is a negative number
 * @param {string} msg An optional error message
 */
Validation.prototype.isNegative = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not a number';
	var error = (Number(self.obj) >= 0);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is an odd number
 * @param {string} msg An optional error message
 */
Validation.prototype.isOdd = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not odd';
	var error = (Number(self.obj) % 2 === 0);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is an even number
 * @param {string} msg An optional error message
 */
Validation.prototype.isEven = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not even';
	var error = (Number(self.obj) % 2 !== 0);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is a finite number
 * @param {string} msg An optional error message
 */
Validation.prototype.isFinite = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is infinite';
	var error = !isFinite(self.obj);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is a function
 * @param {string} msg An optional error message
 */
Validation.prototype.isFunction = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not a function';
	var error = (typeof self.obj !== 'function');
	this.assert(error, msg);
	return this;	
};

/**
 * Checks if the value to validate is a boolean
 * @param {string} msg An optional error message
 */
Validation.prototype.isBoolean = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not a boolean';
	var error = (typeof self.obj !== 'boolean');
	this.assert(error, msg);
	return this;	
};

/**
 * Checks if the value to validate is defined and not null
 * @param {string} msg An optional error message
 */
Validation.prototype.isDefinedAndNonNull = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is undefined or null';
	var error = (self.obj === undefined) || (self.obj === null);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is defined
 * @param {string} msg An optional error message
 */
Validation.prototype.isDefined = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is undefined';
	var error = (self.obj === undefined);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is null
 * @param {string} msg An optional error message
 */
Validation.prototype.isNull = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not null';
	var error = (self.obj !== null);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is an instance of a class
 * @param {function} clz A class
 * @param {string} msg An optional error message
 */
Validation.prototype.isInstanceOf = function(clz, msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not an instance of the given class';
	var error = !(self.obj instanceof clz);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is of a primitive type
 * @param {string} msg An optional error message
 */
Validation.prototype.isPrimitive = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not of a primitive type';
	var type = typeof self.obj;
	var error = ((type !== 'number') && (type !== 'string') && (type !== 'boolean'));
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is an array
 * @param {string} msg An optional error message
 */
Validation.prototype.isArray = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not an array';
	var error = !Array.isArray(self.obj);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate matches a regular expression
 * @param {string} regex A regular expression
 * @param {string} msg An optional error message
 */
Validation.prototype.isMatch = function(regex, msg) {
	var self = this;
	msg = msg || 'Validation failed: object does not match regular expression';
	var error = !(new RegExp(regex).test(self.obj.toString()));
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is valid JSON
 * @param {string} msg An optional error message
 */
Validation.prototype.isJSON = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not valid JSON';
	var error = false;
	try
	{
		error = (typeof JSON.parse(self.obj) !== 'object');
	}
	catch(e)
	{
		error = true;
	}
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate has a given length
 * @param {number} max The maximum length
 * @param {object} arg1 An optional argument
 * @param {object} arg2 An optional argument
 */
Validation.prototype.hasLength = function(max, arg1, arg2) {
	var self = this;
	var msg = findFirstOfType([arg1, arg2], 'string') || 'Validation failed: length does not fall between the given values';	
	var min = findFirstOfType([arg1, arg2], 'number') || 0;		
	var str = self.obj.toString();
	var error = str.length > max;

	if (!error) {
		error = (str.length < min);
	}
	
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is a Promise
 * @param {string} msg An optional error message
 */
Validation.prototype.isPromise = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not a promise';
	var error = ((typeof Promise === 'undefined') || !(self.obj instanceof Promise));
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is a Date
 * @param {string} msg An optional error message
 */
Validation.prototype.isDate = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not a date';
	var error = !(self.obj instanceof Date);
	this.assert(error, msg);
	return this;
};

/**
 * Checks if the value to validate is an Error
 * @param {string} msg An optional error message
 */
Validation.prototype.isError = function(msg) {
	var self = this;
	msg = msg || 'Validation failed: object is not an error';
	var error = !(self.obj instanceof Error);
	this.assert(error, msg);
	return this;
};

/**
 * Negates the validation logic
 * @returns {object} The Validation object
 */
Validation.prototype.not = function() {
	this.negated = !this.negated;
	return this;
};

/**
 * Validates an object
 * @returns {object} The Validation object
 */
Object.prototype.validate = function() {
	return Validation.validate(this);
};

Validation.validate = function(obj) {
	var val = new Validation(obj);
	return val;
};

if (typeof module !== 'undefined') {
	module.exports = Validation;
}