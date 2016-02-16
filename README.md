# FluentValidationJS
A fluent validation library in JavaScript
https://github.com/rjperes/FluentValidationJS
Copyright (c) Ricardo Peres 2016

Usage:

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