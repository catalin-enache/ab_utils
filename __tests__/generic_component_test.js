'use strict';

jest.dontMock('../src/common/helpers');
jest.dontMock('../src/common/validators');
jest.dontMock('../src/components/generic_component');


import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const GenericComponent = require('../src/components/generic_component').default;

describe('GenericComponent', () => {

	it('extends React.Component', () => {
		expect(new GenericComponent() instanceof React.Component).toEqual(true);
		expect(Object.getPrototypeOf(GenericComponent.prototype)).toEqual(React.Component.prototype);
	});

	it('has propTypes', () => {
		expect(GenericComponent.propTypes).toEqual(jasmine.objectContaining({
			name: React.PropTypes.string.isRequired,
			debug: React.PropTypes.bool
		}));
	});

	it('has defaultProps', () => {
		expect(GenericComponent.defaultProps).toEqual(jasmine.objectContaining({
			debug: false
		}));
	});

	describe('_log', () => {

		describe('when debug is true', () => {
			it('logs the message', () => {
				let genCompObj = new GenericComponent({debug: true, name: 'one'});
				spyOn(console, 'log').and.callThrough();
				genCompObj._log('msg');
				expect(console.log).toHaveBeenCalledWith('one > msg');
			});
		});

		describe('when debug is false', () => {
			it('does not log the message', () => {
				let genCompObj = new GenericComponent({debug: false, name: 'one'});
				spyOn(console, 'log').and.callThrough();
				genCompObj._log('msg');
				expect(console.log).not.toHaveBeenCalledWith('one > msg');
			});
		});
	});

	describe('_isControlledComponent', () => {
		it('returns this.props.value !== undefined', () => {
			let genCompObj = new GenericComponent({value: 1, name: 'one'});
			expect(genCompObj._isControlledComponent()).toEqual(true);

			let genCompObj2 = new GenericComponent({name: 'one'});
			expect(genCompObj2._isControlledComponent()).toEqual(false);
		});
	});

	describe('_style', () => {

		it('returns this.props.style[key] if exists and caches the result', () => {
			let genCompObj = new GenericComponent({style: {color: 'black'}, name: 'one'});
			expect(genCompObj._style('color')).toEqual('black');
			expect(genCompObj._style('nonexistent')).toEqual(undefined);
			expect(genCompObj._style('nonexistent', 'default')).toEqual('default');
			expect(genCompObj.__style).toEqual({ color: 'black' });
		});
	});

});


