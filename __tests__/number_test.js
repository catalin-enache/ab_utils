'use strict';

jest.dontMock('../src/common/helpers');
jest.dontMock('../src/decorators/generic_deco');
jest.dontMock('../src/components/generic_component');
jest.dontMock('../src/components/number');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const Number = require('../src/components/number').default;

describe('Number', () => {
	describe('render', () => {

		it('works with defaults', () => {
			let renderer = TestUtils.createRenderer();
			renderer.render(<Number name="one"/>);
			let actualElement = renderer.getRenderOutput();
			let expectedElement = <input type="text"
										 disabled={false}
										 name="one"
										 value={9}/>

			expect(actualElement).toEqual(expectedElement);
		});
	});
});


