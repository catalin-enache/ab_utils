'use strict';

import React from 'react';
import GenericComponent from './generic_component';
import GenericDeco from '../decorators/generic_deco';
import {getWheelDelta} from '../common/helpers';
import {startEndPropType, valueInRangePropType, stepPropType} from '../common/validators';

// =============================== Component =============================

const displayName = 'Slider';

const propTypes = {
	// optional with defaults
	start: startEndPropType,
	end: startEndPropType,
	step: stepPropType,
	orientation: React.PropTypes.string,
	disabled: React.PropTypes.bool,

	// optional no defaults
	value: valueInRangePropType, // monitoring change
	defaultValue: valueInRangePropType,
	onChange: React.PropTypes.func
};

/*
 additional API:
 style: {foregroundColor: 'cssColorValue'}
 Any other style property is passed through to main container when not intentionally overridden
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
		this._stepInPixels = 0;

		this._dragRunning = false;

		this._range = props.end - props.start;
		this._stepsNum = this._range / props.step;

		this._steps = [0];
		for (let s = 1; s <= this._stepsNum; s++) {
			this._steps.push(s/this._stepsNum);
		}

		this.state = {
			percent: 0,
			value: this._getValue()
		};

		this._handleMouseOver = this._handleMouseOver.bind(this);
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

	componentWillReceiveProps(nextProps) {
		// we are listening only for value change
		if (this._isControlledComponent()) {
			this._log(`componentWillReceiveProps => nextProps: ${JSON.stringify(nextProps)}`);
			let percent = this._valueToPercent(nextProps.value);
			this._setPercentValueState(percent, nextProps.value);
		}
	}

	// ============================= Handlers ========================================

	_handleMouseOver(e) {
		this._updateVars();
	}

	_handleMouseDown(e) {
		this._updateVars(); // for devices without mouse over
		document.addEventListener('mousemove', this._handleMouseMove, false);
		document.addEventListener('mouseup', this._handleMouseUp, false);
		this._update(e);
	}

	_handleMouseMove(e) {
		if (this._dragRunning) { return; }
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
		let delta = getWheelDelta(e);
		let pxValue = this._percentToPixelOffset();
		let pxDelta = delta * this._stepInPixels;
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

		this._stepInPixels = this._stepToPixelAmount();

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
				return this._stepping(positionX / this._outerWidth);
			default:
				let positionY = this._outerHeight - (e.clientY - this._offsetTop) ;
				return this._stepping(positionY / this._outerHeight);
		}
	}

	_valueToPercent(value) {
		let position = value - this.props.start;
		let percent = position / this._range;
		return this._stepping(percent);
	}

	_percentToValue(percent) {
		return parseFloat((this._range * percent + this.props.start).toFixed(5));
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
		let pixelsRange = this.props.orientation == 'horizontal' ? this._outerWidth : this._outerHeight;
		if (pixelsRange === 0) { return 0; }
		let stepInPixels = pixelsRange/this._stepsNum;
		if (pixelsRange/stepInPixels !== this._stepsNum) {
			console.warn(this.props.name + `: pixel step(${stepInPixels}) does not fit in pixels range(${pixelsRange})`);
		}
		return stepInPixels;
	}

	// ---------------------------------------------

	_stepping(percent) {
		if (percent > 1) { return 1; }
		else if (percent < 0) { return 0; }

		let steps = this._steps;

		let halfStep = steps[1] / 2;

		for (let i = this._stepsNum; i > 0; i--) {
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

		if (this.state.value === value) {
			return;
		}

		if (this._isControlledComponent()) {
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
				onMouseOver: this._handleMouseOver,
				onMouseDown: this._handleMouseDown,
				onWheel: this._handleMouseWheel
			}
		}

		if (this.props.orientation == 'horizontal') {
			let innerWidth = this._outerWidth * this.state.percent;
			var foregroundStyle = {
				top: '0px',
				right: `${this._outerWidth - innerWidth}px`,
				bottom: '0px',
				left: '0px'
			};
		} else {
			let innerHeight = this._outerHeight * this.state.percent;
			var foregroundStyle = {
				top: `${this._outerHeight - innerHeight}px`,
				right: '0px',
				bottom: '0px',
				left: '0px'
			};
		}

		let fix_drag_bug = {
			MozUserSelect: 'none',
			WebkitUserSelect: 'none',
			UserSelect: 'none'
		};

		// also let props.style pass through
		let backgroundStyle = Object.assign((this.props.style || {}), fix_drag_bug, {
			position: 'relative',
			cursor: this.props.disabled ? 'not-allowed' : 'pointer',
			opacity: this.props.disabled ? 0.5 : 1,
		});

		foregroundStyle = Object.assign(foregroundStyle, fix_drag_bug, {
			position: 'absolute',
		});

		this._style('foregroundColor') && (foregroundStyle.backgroundColor = this._style('foregroundColor'));

		return (
			<div className={`${this.props.className ? this.props.className : ''} ab-slider ab-slider-${this.props.orientation}`}
				 ref="outer"
				 style={backgroundStyle}
				 {...handlers}>
				<div className="ab-slider-fg" style={foregroundStyle}></div>
				<input type="hidden" name={this.props.name} value={this.state.value} disabled={this.props.disabled}/>
			</div>
		);
	}
}

Slider = GenericDeco(Slider);

export default Slider;
