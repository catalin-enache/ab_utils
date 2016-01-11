'use strict';

jest.dontMock('../src/common/helpers');
jest.dontMock('../src/decorators/generic_deco');
jest.dontMock('../src/components/generic_component');
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
			step: 0.01,
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
		let slider = TestUtils.renderIntoDocument(<Slider name="one" />);
		let sliderNode = ReactDOM.findDOMNode(slider);

		expect(sliderNode.childNodes[1].nodeName).toEqual('INPUT');
		expect(sliderNode.childNodes[1].value).toEqual('-1');
	});

	describe('componentDidMount', () => {

		it('calls _updateVars _setPercentValueState _getValue _valueToPercent', () => {
			let slider = TestUtils.renderIntoDocument(<Slider name="one" />);

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

	describe('_handleMouseDown', () => {

		it('calls _updateVars and _update', () => {
			let slider = TestUtils.renderIntoDocument(<Slider name="one" />);
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
				<SliderTest name="one" start={-1} end={1} />
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

		it('adds two event listeners to document', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);
			let sliderNode = ReactDOM.findDOMNode(slider);

			spyOn(document, 'addEventListener');

			TestUtils.Simulate.mouseDown(sliderNode, {clientX: 0});

			expect(document.addEventListener.calls.count()).toEqual(2);
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
						return (<SliderTest ref="slider" value={this.state.value} onChange={this._onChange.bind(this)} />);
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
						return (<SliderTest ref="slider" defaultValue={this.state.value} onChange={this._onChange.bind(this)} />);
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

	describe('_handleMouseUp', () => {

		it('removes two event listeners from document and calls _update', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);

			spyOn(document, 'removeEventListener');
			spyOn(slider, '_update');

			slider._handleMouseUp({clientX: 0});

			expect(document.removeEventListener.calls.count()).toEqual(2);
			expect(slider._update).toHaveBeenCalled();
		})
	});

	describe('_handleMouseMove', () => {

		it('calls requestAnimationFrame (which calls _update) if not _dragRunning', () => {
			let requestAnimationFrameCallbacks = [];
			global.requestAnimationFrame = function(cb){
				requestAnimationFrameCallbacks.push(cb);
			}

			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);

			spyOn(global, 'requestAnimationFrame').and.callThrough();
			spyOn(slider, '_update');

			expect(slider._dragRunning).toEqual(false);
			slider._handleMouseMove({clientX: 0}); // sets requestAnimationFrameCallback
			expect(slider._dragRunning).toEqual(true);
			slider._handleMouseMove({clientX: 0}); // extra event which should not call requestAnimationFrame once again
			expect(requestAnimationFrameCallbacks.length).toEqual(1); // slider._dragRunning prevented extra callbacks
			requestAnimationFrameCallbacks[0](); // simulate window.requestAnimationFrame being executed
			expect(slider._dragRunning).toEqual(false);

			expect(requestAnimationFrame).toHaveBeenCalled();
			expect(slider._update).toHaveBeenCalled();

			delete global.requestAnimationFrame; // clean-up after ourselves
		})
	});

	describe('_handleMouseWheel', () => {

		it('transform wheel delta into an event and calls _update', () => {
			let SliderTest = class extends Slider {
				_getBoundingClientRect() {
					return { bottom: 0, height: 100, left: 0, right: 0, top: 0, width: 100 };
				}
			};
			let slider = TestUtils.renderIntoDocument(
				<SliderTest name="one" step={1} />
			);
			let sliderNode = ReactDOM.findDOMNode(slider);

			spyOn(slider, '_update').and.callThrough();

			TestUtils.Simulate.wheel(sliderNode, {deltaY: -100});

			expect(slider._update).toHaveBeenCalledWith({ clientX: 50, clientY: 50 });
			expect(slider.state.percent).toEqual(0.5);
			expect(slider.state.value).toEqual(0);
		});
	});

	describe('_handleMouseOver', () => {

		it('calls _update', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);
			let sliderNode = ReactDOM.findDOMNode(slider);
			spyOn(slider, '_updateVars');

			TestUtils.Simulate.mouseOver(sliderNode, {});

			expect(slider._updateVars).toHaveBeenCalled();
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

	describe('_valueToPercent without step prop', () => {

		it('calculates percent from passed value', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);
			expect(slider._valueToPercent(0.1)).toEqual(0.55);
		});
	});

	describe('_valueToPercent with step prop', () => {

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

		it('receives a percent and returns a rounded percent depending on default step prop 0.01', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);
			expect(slider._stepping(0.061)).toEqual(0.06);
			expect(slider._stepping(0.091)).toEqual(0.09);
		});
	});

	describe('_getValue', () => {

		it('returns defaultValue or value or start', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);
			expect(slider._getValue()).toEqual(-1);

			slider = TestUtils.renderIntoDocument(
				<Slider name="one" defaultValue={-0.5} />
			);
			expect(slider._getValue()).toEqual(-0.5);

			slider = TestUtils.renderIntoDocument(
				<Slider name="one" value={-0.5} />
			);
			expect(slider._getValue()).toEqual(-0.5);
		});
	});

	describe('_updateVars', () => {

		it('updates some dimension variables', () => {
			let SliderTest = class extends Slider {
				_getBoundingClientRect() {
					return { bottom: 0, height: 100, left: 10, right: 0, top: 10, width: 100 };
				}
				componentDidMount() {}
			};

			let slider = TestUtils.renderIntoDocument(
				<SliderTest name="one" />
			);

			expect(slider._outerWidth).toEqual(0);
			expect(slider._outerHeight).toEqual(0);
			expect(slider._offsetLeft).toEqual(0);
			expect(slider._offsetTop).toEqual(0);
			expect(slider._stepInPixels).toEqual(0);

			slider._updateVars();

			expect(slider._outerWidth).toEqual(100);
			expect(slider._outerHeight).toEqual(100);
			expect(slider._offsetLeft).toEqual(10);
			expect(slider._offsetTop).toEqual(10);
			expect(slider._stepInPixels).toEqual(0.5);
		});
	});

	describe('_getBoundingClientRect', () => {

		it('returns refs.outer.getBoundingClientRect()', () => {
			let slider = TestUtils.renderIntoDocument(
				<Slider name="one" />
			);

			spyOn(slider.refs.outer, 'getBoundingClientRect');

			slider._getBoundingClientRect();

			expect(slider.refs.outer.getBoundingClientRect).toHaveBeenCalled();
		});
	});

	describe('_update', () => {

		describe('when this.state.value === value', () => {

			it('it does not call any methods related to setting state or emitting value changed event', () => {
				let slider = TestUtils.renderIntoDocument(
					<Slider value={0} name="one" />
				);

				spyOn(slider, '_eventToPercent').and.returnValue(0.5);
				spyOn(slider, '_percentToValue').and.returnValue(0); // the same as current one
				spyOn(slider, '_emitValueChangeEvent');
				spyOn(slider, '_setPercentValueStateAndEmitValueChangedEvent');

				slider._update({});

				expect(slider._emitValueChangeEvent).not.toHaveBeenCalled();
				expect(slider._setPercentValueStateAndEmitValueChangedEvent).not.toHaveBeenCalled();
			});
		});

		describe('when _isControlledComponent', () => {

			it('calls _emitValueChangeEvent', () => {
				let slider = TestUtils.renderIntoDocument(
					<Slider value={-1} name="one" />
				);
				spyOn(slider, '_eventToPercent').and.returnValue(0.5);
				spyOn(slider, '_percentToValue').and.returnValue(0);
				spyOn(slider, '_emitValueChangeEvent');
				spyOn(slider, '_setPercentValueStateAndEmitValueChangedEvent');

				slider._update({});

				expect(slider._emitValueChangeEvent).toHaveBeenCalledWith(0);
				expect(slider._setPercentValueStateAndEmitValueChangedEvent).not.toHaveBeenCalled();
			});
		});

		describe('when not _isControlledComponent', () => {
			it('calls _setPercentValueStateAndEmitValueChangedEvent', () => {
				let slider = TestUtils.renderIntoDocument(
					<Slider defaultValue={-1} name="one" />
				);
				spyOn(slider, '_eventToPercent').and.returnValue(0.5);
				spyOn(slider, '_percentToValue').and.returnValue(0);
				spyOn(slider, '_emitValueChangeEvent');
				spyOn(slider, '_setPercentValueStateAndEmitValueChangedEvent');

				slider._update({});

				expect(slider._emitValueChangeEvent).not.toHaveBeenCalled();
				expect(slider._setPercentValueStateAndEmitValueChangedEvent).toHaveBeenCalledWith(0.5, 0);
			});
		});
	});

	xdescribe('_emitValueChangeEvent', () => {});

	xdescribe('_setPercentValueState', () => {});

	xdescribe('_setPercentValueStateAndEmitValueChangedEvent', () => {});

	xdescribe('render', () => {});

});


