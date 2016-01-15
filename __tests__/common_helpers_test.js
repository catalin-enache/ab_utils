'use strict';

jest.dontMock('../src/common/helpers');

let {trim, getWheelDelta} = require('../src/common/helpers');

describe('trim', () => {

	it('trims white space from passed string', () => {
		let result = trim('   xxx   ');
		expect(result).toEqual('xxx');

		result = trim('...xxx---', /\.+/, /-+/);
		expect(result).toEqual('xxx');
	});
});

describe('getWheelDelta', () => {

	it('returns small multiples of +-1', () => {
		let result = getWheelDelta({deltaY: -100});
		expect(result).toEqual(1);

		result = getWheelDelta({deltaY: 100});
		expect(result).toEqual(-1);

		result = getWheelDelta({deltaY: -3});
		expect(result).toEqual(1);

		result = getWheelDelta({deltaY: 3});
		expect(result).toEqual(-1);

		result = getWheelDelta({deltaY: -200});
		expect(result).toEqual(2);

		result = getWheelDelta({deltaY: -6});
		expect(result).toEqual(2);

		result = getWheelDelta({deltaY: -100, ctrlKey: true});
		expect(result).toEqual(5);

		result = getWheelDelta({deltaY: -100, altKey: true});
		expect(result).toEqual(10);

		result = getWheelDelta({deltaY: -100, ctrlKey: true, altKey: true});
		expect(result).toEqual(100);
	});
});

