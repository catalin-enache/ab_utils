'use strict';

import React from 'react';
import GenericComponent from './generic_component';
import GenericDeco from '../decorators/generic_deco';
import getWheelDelta from '../helpers/mouse_wheel_delta';

/*
 TODO: must not allow receiving value along with defaultValue
 TODO: further investigate chrome drag slider issue (currently fixed by forbidding * select in examples css)
 TODO: make sure components do not depend on any style included in provided examples
 TODO: finish tests
 */

// ============================ Custom Validators =================================

function startEndPropType(props, propName, componentName) {
	let error = React.PropTypes.number(props, propName, componentName);
	if (error !== null) return error;

	if (props.start >= props.end) {
		let errorMsg = (propName === 'start') ? 'start should be less than end' : 'end should be greater than start';
		return new Error(errorMsg);
	}
}

function valueInRangePropType(props, propName, componentName) {
	let error = React.PropTypes.number(props, propName, componentName);
	if (error !== null) return error;

	let value = props[propName];
	if (value !== undefined && !valueInRange(value, props)) {
		return new Error(propName + ' should be within the range specified by start and end');
	}
}

function stepPropType(props, propName, componentName) {
	let error = React.PropTypes.number(props, propName, componentName);
	if (error !== null) {
		return error;
	}

	let value = props[propName];
	let range = props.end - props.start;
	let stepsNum = range / value;

	if (stepsNum != parseInt(stepsNum)) {
		return new Error(propName + ` (${value}) does not fit in range (${props.start}..${props.end})`);
	}
}

// =============================== Helpers ===============================

function valueInRange(value, props) {
	return props.start <= value && value <= props.end;
}

// =============================== Component =============================

const DEFAULT_SIZE = '100px';
const DEFAULT_THICKNESS = '5px';

const displayName = 'Slider';

const propTypes = {
	// optional with defaults
	start: startEndPropType,
	end: startEndPropType,
	step: stepPropType,
	orientation: React.PropTypes.string,
	disabled: React.PropTypes.bool,

	// optional no defaults
	value: valueInRangePropType,
	defaultValue: valueInRangePropType,
	onChange: React.PropTypes.func
};

/*
 additional API:
 style: {bgColor: 'cssColorValue', fgColor: 'cssColorValue'}
 Any other style property is passed through when not intentionally overridden
 */

const defaultProps = {
	start: -1,
	end: 1,
	step: 0.01,
	orientation: 'horizontal',
	disabled: false
};

class Slider extends GenericComponent {

	static get displayName() {
		return displayName;
	}

	static get propTypes() {
		return Object.assign({}, super.propTypes, propTypes);
	}

	static get defaultProps() {
		return Object.assign({}, super.defaultProps, defaultProps);
	}

	// ======================= React APIs ===================================

	constructor(props) {
		super(props);

		this._outerWidth = 0;
		this._outerHeight = 0;
		this._offsetLeft = 0;
		this._offsetTop = 0;
		this._dragRunning = false;

		this.state = {
			percent: 0,
			value: this._getValue()
		};

		this._handleMouseMove = this._handleMouseMove.bind(this);
		this._handleMouseUp = this._handleMouseUp.bind(this);
		this._handleMouseDown = this._handleMouseDown.bind(this);
		this._handleMouseWheel = this._handleMouseWheel.bind(this);
	}

	componentDidMount() {
		this._log(`componentDidMount`);
		this._updateVars();
		let value = this._getValue();
		let percent = this._valueToPercent(value);
		this._setPercentValueState(percent, value);
	}

	shouldComponentUpdate (nextProps, nextState) {
		return nextState.percent !== this.state.percent;
	}

	componentWillReceiveProps(nextProps) {
		if (this._isControlledComponent()) {
			this._log(`componentWillReceiveProps => nextProps: ${JSON.stringify(nextProps)}`);
			let percent = this._valueToPercent(nextProps.value);
			this._setPercentValueState(percent, nextProps.value);
		}
	}

	// ============================= Handlers ========================================

	_handleMouseDown(e) {
		this._updateVars();
		document.addEventListener('mousemove', this._handleMouseMove, false);
		document.addEventListener('mouseup', this._handleMouseUp, false);
		this._update(e);
	}

	_handleMouseMove(e) {
		if (this._dragRunning) {
			return;
		}
		this._dragRunning = true;
		requestAnimationFrame(() => {
			this._update(e);
			this._dragRunning = false;
		});
	}

	_handleMouseUp(e) {
		document.removeEventListener('mousemove', this._handleMouseMove, false);
		document.removeEventListener('mouseup', this._handleMouseUp, false);
		this._update(e);
	}

	_handleMouseWheel(e) {
		e.preventDefault();
		this._updateVars();
		let delta = getWheelDelta(e);
		let pxValue = this._percentToPixelOffset();
		let pxDelta = delta * this._stepToPixelAmount();
		pxValue += this.props.orientation == 'horizontal' ? pxDelta : -pxDelta;
		let event = {clientX: pxValue, clientY: pxValue};
		this._update(event);
	}

	// ============================ Helpers ===========================================

	_updateVars() {
		let boundingClientRect = this._getBoundingClientRect();

		this._outerWidth = parseInt(boundingClientRect.width);
		this._outerHeight = parseInt(boundingClientRect.height);
		this._offsetLeft = parseInt(boundingClientRect.left);
		this._offsetTop = parseInt(boundingClientRect.top);

		this._log(`_updateVars: _outerWidth: ${this._outerWidth} _outerHeight: ${this._outerHeight} _offsetLeft: ${this._offsetLeft} _offsetTop: ${this._offsetTop} `)
	}

	_getBoundingClientRect() {
		return this.refs.outer.getBoundingClientRect();
	}

	_getValue() {
		return (this.props.value !== undefined
				? this.props.value
				: this.props.defaultValue !== undefined
				? this.props.defaultValue
				: this.props.start
		);
	}

	// ----------- converters ----------

	_eventToPercent(e) {
		switch (this.props.orientation) {
			case 'horizontal':
				let positionX = e.clientX - this._offsetLeft;
				return this._stepping(parseFloat((positionX / this._outerWidth).toFixed(5)));
			default:
				let positionY = this._outerHeight - (e.clientY - this._offsetTop) ;
				return this._stepping(parseFloat((positionY / this._outerHeight).toFixed(5)));
		}
	}

	_valueToPercent(value) {
		let range = this.props.end - this.props.start;
		let position = value - this.props.start;
		let percent = parseFloat((position / range).toFixed(5));
		return this._stepping(percent);
	}

	_percentToValue(percent) {
		let range = this.props.end - this.props.start;
		return parseFloat((range * percent + this.props.start).toFixed(5));
	}

	_percentToPixelOffset() {
		switch (this.props.orientation) {
			case 'horizontal':
				return this._offsetLeft + this._outerWidth * this.state.percent;
			default:
				return this._offsetTop + this._outerHeight - this._outerHeight * this.state.percent;
		}
	}

	_stepToPixelAmount() {
		let stepsNum = (this.props.end - this.props.start) / this.props.step;
		let fullRange = this.props.orientation == 'horizontal' ? this._outerWidth : this._outerHeight;
		let range = fullRange/stepsNum;
		if (fullRange/range != parseInt(fullRange/range)) {
			console.warn(this.props.name + `: pixel step(${range}) does not fit in pixels range(${fullRange})`);
		}
		return range;
	}

	// ---------------------------------------------

	_stepping(percent) {
		if (percent > 1) { return 1; }
		else if (percent < 0) { return 0; }

		let stepsNum = (this.props.end - this.props.start) / this.props.step;

		let steps = [0];
		for (let s = 1; s <= stepsNum; s++) {
			steps.push(s/stepsNum);
		}

		let halfStep = steps[1] / 2;

		for (let i = stepsNum; i > 0; i--) {
			if (percent >= steps[i] - halfStep) {
				return steps[i];
			} else if (percent > steps[i - 1]) {
				return steps[i - 1];
			}
		}
		return 0;
	}

	_update(e) {
		let percent = this._eventToPercent(e);
		let value = this._percentToValue(percent);

		if (this._isControlledComponent() && this.state.value !== value) {
			this._emitValueChangeEvent(value);
		} else {
			this._setPercentValueStateAndEmitValueChangedEvent(percent, value);
		}
	}

	_emitValueChangeEvent(value) {
		if (this.props.onChange === undefined) {
			return;
		}
		this._log(`_emitValueChangeEvent => value: ${value}`);
		this.props.onChange(value);
	}

	_setPercentValueState(percent, value, callback = null) {
		if (this.state.percent === percent) {
			return;
		}
		this._log(`_setPercentValueState => percent from: ${this.state.percent}, ${this.state.value} to: ${percent}, ${value}`);
		this.setState({percent: percent, value: value}, callback);
	}

	_setPercentValueStateAndEmitValueChangedEvent(percent, value) {
		this._setPercentValueState(percent, value, () => {
			this._emitValueChangeEvent(value);
		});
	}

	// ============================= Render ===========================================

	render() {

		this._log(`render => state: ${JSON.stringify(this.state)} | props: ${JSON.stringify(this.props)}`);

		let handlers = {};
		if (!this.props.disabled) {
			handlers = {
				onMouseDown: this._handleMouseDown,
				onWheel: this._handleMouseWheel
			}
		}

		if (this.props.orientation == 'horizontal') {

			let innerWidth = this._outerWidth * this.state.percent;

			var backgroundStyle = {
				width: this._style('width', DEFAULT_SIZE),
				height: this._style('height', DEFAULT_THICKNESS)
			};

			var foregroundStyle = {
				top: '0px',
				right: `${this._outerWidth - innerWidth}px`,
				bottom: '0px',
				left: '0px'
			};

		} else {

			let innerHeight = this._outerHeight * this.state.percent;

			var backgroundStyle = {
				height: this._style('height', DEFAULT_SIZE),
				width: this._style('width', DEFAULT_THICKNESS)
			};

			var foregroundStyle = {
				top: `${this._outerHeight - innerHeight}px`,
				right: '0px',
				bottom: '0px',
				left: '0px'
			};

		}

		// also let props.style pass through
		backgroundStyle = Object.assign((this.props.style || {}), backgroundStyle, {
			position: 'relative',
			cursor: this.props.disabled ? 'not-allowed' : 'pointer',
			opacity: this.props.disabled ? 0.5 : 1,
			backgroundColor: this._style('bgColor')
		});

		foregroundStyle = Object.assign(foregroundStyle, {
			position: 'absolute',
			backgroundColor: this._style('fgColor')
		});

		return (
			<div ref="outer" style={backgroundStyle} {...handlers}>
				<div style={foregroundStyle}></div>
				<input type="hidden" name={this.props.name} value={this.state.value} disabled={this.props.disabled}/>
			</div>
		);
	}
}

Slider = GenericDeco(Slider);

export default Slider;
