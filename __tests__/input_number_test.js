'use strict';

jest.dontMock('../src/common/helpers');
jest.dontMock('../src/common/validators');
jest.dontMock('../src/decorators/generic_deco');
jest.dontMock('../src/decorators/selection_disableable_deco');
jest.dontMock('../src/components/generic_component');
jest.dontMock('../src/components/input_number');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const InputNumber = require('../src/components/input_number').default;

// this test is incomplete so far

describe('InputNumber', () => {

	it('has defaultProps', () => {
		let inputNumber = TestUtils.renderIntoDocument(<InputNumber name="one"/>);
		expect(inputNumber.props).toEqual(jasmine.objectContaining({
			debug: false,
			disabled: false,
			end: 1,
			name: 'one',
			readOnly: false,
			start: 0,
			step: 0.01
		}));
	});

	it('requires "name" prop', () => {
		spyOn(console, 'error');
		TestUtils.renderIntoDocument(<InputNumber />);
		expect(console.error).toHaveBeenCalledWith('Warning: Failed propType: Required prop `name` was not specified in `InputNumber`.');
	});

	describe('_normalizeValue', () => {

		it('accepts a value and return a normalized one', () => {
			let inputNumber = TestUtils.renderIntoDocument(<InputNumber name="one" start={-1} />);

			// pass through as is
			let res1 = inputNumber._normalizeValue('-', true);
			expect(res1).toEqual('-');

			let res1_2 = inputNumber._normalizeValue('-.', true);
			expect(res1_2).toEqual('-.');

			let res3 = inputNumber._normalizeValue('', true);
			expect(res3).toEqual('');

			// force returning current state.value
			let res4 = inputNumber._normalizeValue('x', true);
			expect(res4).toEqual('-1');

			let res4_2 = inputNumber._normalizeValue('.', true);
			expect(res4_2).toEqual('-1');

			// limit to min max
			let res5 = inputNumber._normalizeValue('-2');
			expect(res5).toEqual('-1');

			let res6 = inputNumber._normalizeValue('2');
			expect(res6).toEqual('1');

			// return value as received
			let res7 = inputNumber._normalizeValue('-0.');
			expect(res7).toEqual('-0.');

			let res8 = inputNumber._normalizeValue('0');
			expect(res8).toEqual('0');

		});
	});

	describe('_getInitialValue', () => {

		it('returns defaultValue or value or start', () => {
			let inputNumber = TestUtils.renderIntoDocument(
				<InputNumber name="one"  />
			);
			expect(inputNumber._getInitialValue()).toEqual('0');

			inputNumber = TestUtils.renderIntoDocument(
				<InputNumber name="one" defaultValue={'0.5'} />
			);
			expect(inputNumber._getInitialValue()).toEqual('0.5');

			inputNumber = TestUtils.renderIntoDocument(
				<InputNumber name="one" value={'0.6'} />
			);
			expect(inputNumber._getInitialValue()).toEqual('0.6');
		});
	});

});


