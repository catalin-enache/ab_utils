'use strict';

jest.dontMock('../src/common/helpers');
jest.dontMock('../src/decorators/generic_deco');
jest.dontMock('../src/components/generic_component');
jest.dontMock('../src/components/input_number');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const InputNumber = require('../src/components/input_number').default;

describe('Number', () => {

	xdescribe('render', () => {

		it('works with defaults', () => {
			let renderer = TestUtils.createRenderer();
			renderer.render(<InputNumber name="one"/>);
			let actualElement = renderer.getRenderOutput();
			let expectedElement = <input type="text"
										 disabled={false}
										 name="one"
										 value={9}/>

			expect(actualElement).toEqual(expectedElement);
		});
	});
});


