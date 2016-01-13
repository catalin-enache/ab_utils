'use strict';

jest.dontMock('../src/common/validators');
jest.dontMock('../src/common/helpers');

let {startEndPropType,
	valueInRangePropType,
	stepPropType,
	validateNumberString,
	numberStringAndValueInRangePropType} = require('../src/common/validators');

describe('startEndPropType', () => {
	it('expects start & end values to be of type number', () => {
		let result = startEndPropType({start: '2'}, 'start', 'SomeComponent');
		expect(result.message).toMatch('`string` supplied to `SomeComponent`, expected `number`');
	});

	it('expects start < end', () => {
		let result = startEndPropType({start: 2, end: 1}, 'start', 'SomeComponent');
		expect(result.message).toMatch('start should be less than end');
	});

	it('expects start - end !== 0', () => {
		let result = startEndPropType({start: 2, end: 2}, 'start', 'SomeComponent');
		expect(result.message).toMatch('start should be less than end');
	});
});

describe('valueInRangePropType', () => {
	it('expects value or defaultValue to be of type number', () => {
		let result = valueInRangePropType({value: '1'}, 'value', 'SomeComponent');
		expect(result.message).toMatch('`string` supplied to `SomeComponent`, expected `number`');
	});

	it('does not allow value and defaultValue to be both defined', () => {
		let result = valueInRangePropType({value: 1, defaultValue: 1}, 'value', 'SomeComponent');
		expect(result.message).toMatch('Component should have either value or defaultValue, not both');
	});

	it('allows value and defaultValue be undefined', () => {
		let result = valueInRangePropType({}, 'value', 'SomeComponent');
		expect(result).toBeUndefined();
	});

	it('expects value and defaultValue to be in range defined by start end props ', () => {
		let result = valueInRangePropType({start: 0, end: 1, value: 1.1}, 'value', 'SomeComponent');
		expect(result.message).toMatch('value should be within the range specified by start and end');
	});
});

describe('stepPropType prop validator', () => {
	it('expects step to be of type number', () => {
		let result = stepPropType({step: '1'}, 'step', 'SomeComponent');
		expect(result.message).toMatch('`step` of type `string` supplied to `SomeComponent`, expected `number`');
	});

	it('expects step to be greater than 0', () => {
		let result = stepPropType({step: -1}, 'step', 'SomeComponent');
		expect(result.message).toMatch('step must be greater than 0');
	});

	it('expects step to properly fit in range', () => {
		let result = stepPropType({step: 0.3, start: 0, end: 1}, 'step', 'SomeComponent');
		expect(result.message).toMatch('does not fit in range 1');
	});
});

describe('validateNumberString', () => {
	it('validates a string as a float number', () => {
		let res1 = validateNumberString('.0');
		let res2 = validateNumberString('0.');
		let res3 = validateNumberString('0.0');
		let res4 = validateNumberString('-.0');
		let res5 = validateNumberString('-0.');
		let res6 = validateNumberString('-0.0');

		let res7 = validateNumberString('-');
		let res8 = validateNumberString('.');

		expect(res1).toEqual(true);
		expect(res2).toEqual(true);
		expect(res3).toEqual(true);
		expect(res4).toEqual(true);
		expect(res5).toEqual(true);
		expect(res6).toEqual(true);

		expect(res7).toEqual(false);
		expect(res8).toEqual(false);
	});
});

describe('numberStringAndValueInRangePropType', () => {
	it('validates a string as a float number and check whether is in range', () => {
		let res1 = numberStringAndValueInRangePropType({start: -1, end: 1, value: ' x '}, 'value', 'SomeComponent');
		expect(res1).toMatch('must be a valid number representation');

		let res2 = numberStringAndValueInRangePropType({start: -1, end: 1, value: ' -. '}, 'value', 'SomeComponent');
		expect(res2).toBeUndefined();

		let res3 = numberStringAndValueInRangePropType({start: -1, end: 1, value: ' 0.0 '}, 'value', 'SomeComponent');
		expect(res3).toBeUndefined();

		let res4 = numberStringAndValueInRangePropType({start: -1, end: 1, value: ' 1.1 '}, 'value', 'SomeComponent');
		expect(res4.message).toMatch('value should be within the range specified by start and end');
	});
});
