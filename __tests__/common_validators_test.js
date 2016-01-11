'use strict';

jest.dontMock('../src/common/validators');

let {startEndPropType, valueInRangePropType} = require('../src/common/validators');

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
