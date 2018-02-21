# FluentValidationJS
A fluent validation library for JavaScript

https://github.com/rjperes/FluentValidationJS

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

## Contacts
If you see any value in this and wish to send me your comments, please do so through GitHub. Questions and suggestions are welcome too!

## Licenses
This software is distributed under the terms of the Free Software Foundation Lesser GNU Public License (LGPL), version 2.1 (see lgpl.txt).

## Copyright
Copyright (c) Ricardo Peres 2018
You are free to use this as you wish, but I ask you to please send me a note about it.
