# FluentValidationJS
A fluent validation library for JavaScript

https://github.com/rjperes/FluentValidationJS

Copyright (c) Ricardo Peres 2016

Usage:

<pre>
var obj = '1';

Validation
	.validate(obj)
	.reporting(function(msg) { console.log(msg) })
	.isPrimitive()
	.isValid(function(x) { return true })
	.contains('1')
	.isOdd()
	.isOneOf('1', '2', '3')
	.isNoneOf('4', '5', '6')
	.isEqualTo(1)
	.isDefined()
	.isNotNullOrWhitespace()
	.isString()
	.isNumber()
	.hasLength(2, 1)
	.isMatch('\\d+')
	.isPositive()
	.not()
	.isInstanceOf(Number)
	.isNull()
	.isEven()
	.isNegative()
	.isPromise()
	.isArray()
	.isFunction()
	.isDate()
	.isError()
	.isJSON()
	.throwOnError();
</pre>

By default, adds all errors to an array. Then, one of the terminal methods should be called:

<pre>
throwOnError: does just what it says
getErrors: retrieves the list of validation errors
hasErrors: returns true if there are validation errors
check: returns true if there are no validation errors
</pre>

It can be used in Node.js:

<pre>
var Validation = require("./fluent-validation");
</pre>