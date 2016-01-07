'use strict';

jest.dontMock('../src/components/generic_component');
jest.dontMock('../src/decorators/generic_deco');
jest.dontMock('../src/components/slider');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const Slider = require('../src/components/slider').default;

describe('Slider', () => {

	it('has defaultProps', () => {

		let slider = TestUtils.renderIntoDocument(<Slider name="one" />);

		expect(slider.props).toEqual(jasmine.objectContaining({
			name: 'one',
			debug: false,
			start: -1,
			end: 1,
			step: null,
			orientation: 'horizontal',
			disabled: false
		}));
	});

	it('requires "name" prop', () => {
		spyOn(console, 'error');
		TestUtils.renderIntoDocument(<Slider />);
		expect(console.error).toHaveBeenCalledWith('Warning: Failed propType: Required prop `name` was not specified in `Slider`.');
	});

	it('has an associated hidden form element ', () => {
		let slider = TestUtils.renderIntoDocument(<Slider />);
		let sliderNode = ReactDOM.findDOMNode(slider);

		expect(sliderNode.childNodes[1].nodeName).toEqual('INPUT');
		expect(sliderNode.childNodes[1].value).toEqual('-1');
	});

	describe('componentDidMount', () => {

		it('calls _updateVars and _setPercentValueState', () => {
			let slider = TestUtils.renderIntoDocument(<Slider />);

			spyOn(slider, '_updateVars');
			spyOn(slider, '_setPercentValueState');
			spyOn(slider, '_getValue').and.returnValue(1);
			spyOn(slider, '_valueToPercent').and.returnValue(0.5);

			slider.componentDidMount();

			expect(slider._updateVars).toHaveBeenCalled();
			expect(slider._setPercentValueState).toHaveBeenCalledWith(0.5, 1);
			expect(slider._getValue).toHaveBeenCalled();
			expect(slider._valueToPercent).toHaveBeenCalledWith(1);
		});
	});

	describe('onMouseDown', () => {

		it('calls _updateVars and _update', () => {
			let slider = TestUtils.renderIntoDocument(<Slider />);
			let sliderNode = ReactDOM.findDOMNode(slider);

			spyOn(slider, '_updateVars');
			spyOn(slider, '_update');

			TestUtils.Simulate.mouseDown(sliderNode, {clientX: 0});

			expect(slider._updateVars).toHaveBeenCalled();
			expect(slider._update).toHaveBeenCalledWith(jasmine.objectContaining({clientX: 0}));
		});

		it('changes state value and percent', () => {
			let SliderTest = class extends Slider {
				_getBoundingClientRect() {
					return { bottom: 0, height: 100, left: 0, right: 0, top: 0, width: 100 };
				}
			};

			let slider = TestUtils.renderIntoDocument(
				<SliderTest name="one" start={-1} end={1} style={{width: 100}} debug={false} />
			);

			let sliderNode = ReactDOM.findDOMNode(slider);

			expect(sliderNode.childNodes[1].value).toEqual('-1');
			expect(slider.state.value).toEqual(-1);
			expect(slider.state.percent).toEqual(0);

			TestUtils.Simulate.mouseDown(sliderNode, {clientX: 50});

			expect(sliderNode.childNodes[1].value).toEqual('0');
			expect(slider.state.value).toEqual(0);
			expect(slider.state.percent).toEqual(0.5);
		});

		describe('when has "value" prop - is controlled', () => {

			it('setState after _emitValueChangeEvent', () => {

				let SliderTest = class extends Slider {
					_getBoundingClientRect() {
						return { bottom: 0, height: 100, left: 0, right: 0, top: 0, width: 100 };
					}
				};

				let App = class extends React.Component {
					constructor(props) {
						super(props);
						this.state = {value: -1};
					}

					_onChange() { this.setState({value: 0}); }

					render() {
						return (<SliderTest ref="slider" value={this.state.value} onChange={this._onChange.bind(this)} style={{width: 100}} />);
					}
				};

				let app  = TestUtils.renderIntoDocument(<App />);
				let slider = app.refs.slider;
				let sliderNode = ReactDOM.findDOMNode(slider);

				let setState = slider.setState;
				let _emitValueChangeEvent = slider._emitValueChangeEvent;

				let calls = [];

				spyOn(slider, 'setState').and.callFake((...args) => {
					calls.push('setState');
					setState.call(slider, ...args);
				});

				spyOn(slider, '_emitValueChangeEvent').and.callFake((...args) => {
					calls.push('_emitValueChangeEvent');
					_emitValueChangeEvent.call(slider, ...args);
				});

				TestUtils.Simulate.mouseDown(sliderNode, {clientX: 50});

				expect(calls).toEqual(['_emitValueChangeEvent', 'setState']);
			});
		});

		describe('when has "defaultValue" prop - is uncontrolled', () => {

			it('setState before _emitValueChangeEvent then it does not setState anymore', () => {
				let SliderTest = class extends Slider {
					_getBoundingClientRect() {
						return { bottom: 0, height: 100, left: 0, right: 0, top: 0, width: 100 };
					}
				};

				let App = class extends React.Component {
					constructor(props) {
						super(props);
						this.state = {value: -1};
					}

					_onChange() { this.setState({value: 0}); }

					render() {
						return (<SliderTest ref="slider" defaultValue={this.state.value} onChange={this._onChange.bind(this)} style={{width: 100}} />);
					}
				};

				let app  = TestUtils.renderIntoDocument(<App />);
				let slider = app.refs.slider;

				let sliderNode = ReactDOM.findDOMNode(slider);

				let setState = slider.setState;
				let _emitValueChangeEvent = slider._emitValueChangeEvent;

				let calls = [];

				spyOn(slider, 'setState').and.callFake((...args) => {
					calls.push('setState');
					setState.call(slider, ...args);
				});

				spyOn(slider, '_emitValueChangeEvent').and.callFake((...args) => {
					calls.push('_emitValueChangeEvent');
					_emitValueChangeEvent.call(slider, ...args);
				});

				TestUtils.Simulate.mouseDown(sliderNode, {clientX: 50});

				expect(calls).toEqual(['setState', '_emitValueChangeEvent']);
			});
		});
	});

	describe('_eventToPercent', () => {
		it('calculates percent from passed event', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);
			slider._outerWidth = 100;
			expect(slider._eventToPercent({clientX: 50})).toEqual(0.5);
		});
	});

	describe('_valueToPercent', () => {
		it('calculates percent from passed value', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);
			expect(slider._valueToPercent(0.1)).toEqual(0.55);
		});
	});

	describe('_valueToPercent with stepping', () => {
		it('calculates percent from passed value and applies stepping', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" step={1} />
			);
			expect(slider._valueToPercent(0.1)).toEqual(0.5);
		});
	});

	describe('_percentToValue', () => {
		it('calculates value from passed percent', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one"  />
			);
			expect(slider._percentToValue(0.1)).toEqual(-0.8);
		});
	});

	describe('_stepping with step prop', () => {
		it('receives a percent and returns a rounded percent depending on step prop', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" step={0.1}  />
			);
			expect(slider._stepping(0.06)).toEqual(0.05);
			expect(slider._stepping(0.09)).toEqual(0.1);
		});
	});

	describe('_stepping without step prop', () => {
		it('receives a percent and returns a rounded percent depending on step prop', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);
			expect(slider._stepping(0.06)).toEqual(0.06);
			expect(slider._stepping(0.09)).toEqual(0.09);
		});
	});

	xdescribe('_update', () => {});

	xdescribe('_emitValueChangeEvent', () => {});

	xdescribe('_setPercentValueState', () => {});

	xdescribe('_setPercentValueStateAndEmitValueChangedEvent', () => {});

	xdescribe('render', () => {});
});


