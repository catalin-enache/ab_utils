'use strict';

import React from 'react';
import GenericComponent from './generic_component';
import GenericDeco from '../decorators/generic_deco';
import SelectionDisableableDeco from '../decorators/selection_disableable_deco';
import {getWheelDelta} from '../common/helpers';
import {startEndPropType, stepPropType, numberStringAndValueInRangePropType, validateNumberString} from '../common/validators';

const displayName = 'InputNumber';

const propTypes = {
	// optional with defaults
	start: startEndPropType,
	end: startEndPropType,
	step: stepPropType,
	disabled: React.PropTypes.bool,
	readOnly: React.PropTypes.bool,

	// optional no defaults
	value: numberStringAndValueInRangePropType, // monitoring change
	defaultValue: numberStringAndValueInRangePropType,
	onChange: React.PropTypes.func
};

const defaultProps = {
	start: 0,
	end: 1,
	step: 0.01,
	disabled: false,
	readOnly: false
};

const CONTROLLERS_WRAPPER_WIDTH = 16;

class InputNumber extends GenericComponent {

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

		this._wrapperHeight = 0;
		this._inputWidth = 0;
		this._toFixed = props.step === 1 ? 0 : 2;
		this._dragRunning = false; // animationFrame overlap control
		this._valueOnDragStart = undefined; // dragStart state
		this._yPosOnDragStart = undefined; // dragStart state
		this._controlsUpArrowStateClass = '';
		this._controlsDownArrowStateClass = '';


		this.state = {
			value: this._getInitialValue(),
		};

		this._handleOnChange = this._handleOnChange.bind(this);
		this._handleMouseWheel = this._handleMouseWheel.bind(this);

		this._handleUpArrowMouseDown = this._handleUpArrowMouseDown.bind(this);
		this._handleUpArrowMouseUp = this._handleUpArrowMouseUp.bind(this);
		this._handleDownArrowMouseDown = this._handleDownArrowMouseDown.bind(this);
		this._handleDownArrowMouseUp = this._handleDownArrowMouseUp.bind(this);
		this._handleDraggableMouseDown = this._handleDraggableMouseDown.bind(this);
		this._handleDraggableMouseMove = this._handleDraggableMouseMove.bind(this);
		this._handleDraggableMouseUp = this._handleDraggableMouseUp.bind(this);

		this._handleUpArrowTouchStart = this._handleUpArrowTouchStart.bind(this);
		this._handleUpArrowTouchEnd = this._handleUpArrowTouchEnd.bind(this);
		this._handleDownArrowTouchStart = this._handleDownArrowTouchStart.bind(this);
		this._handleDownArrowTouchEnd = this._handleDownArrowTouchEnd.bind(this);
		this._handleDraggableTouchStart = this._handleDraggableTouchStart.bind(this);
		this._handleDraggableTouchMove = this._handleDraggableTouchMove.bind(this);
		this._handleDraggableTouchEnd = this._handleDraggableTouchEnd.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		// we are listening only for value change
		if (this._isControlledComponent()) {
			this._log(`componentWillReceiveProps => nextProps: ${JSON.stringify(nextProps)}`);
			this._setValueState(this._normalizeValue(nextProps.value));
		}
	}

	componentDidMount() {
		this._log(`componentDidMount`);
		this._updateVars();
		this.forceUpdate();
	}

	// ============================= Handlers ========================================

	_handleOnChange(e) {
		this._log(`_handleOnChange ${e.target.value}`);
		this._update(this._normalizeValue(e.target.value), true); // direct user input is also validated
	}

	_handleMouseWheel(e) {
		e.preventDefault();
		let delta = getWheelDelta(e);
		let value = this._getCurrentValueAsNumber();
		value += delta * this.props.step;
		this._update(this._normalizeValue(value.toFixed(this._toFixed)));
	}

	_handleUpArrowMouseDown(e) {
		console.log('_handleUpArrowMouseDown');
		this._controlsUpArrowStateClass = 'ab-active';
		let value = this._getCurrentValueAsNumber();
		value += this.props.step;
		document.addEventListener('mouseup', this._handleUpArrowMouseUp, false);
		this._update(this._normalizeValue(value.toFixed(this._toFixed)));
	}

	_handleUpArrowTouchStart(e) {
		console.log('_handleUpArrowTouchStart');
		e.preventDefault(); // tap-highlight related
		this._controlsUpArrowStateClass = 'ab-active';
		let value = this._getCurrentValueAsNumber();
		value += this.props.step;
		document.addEventListener('touchend', this._handleUpArrowTouchEnd, false);
		document.addEventListener('touchcancel', this._handleUpArrowTouchEnd, false);
		this._update(this._normalizeValue(value.toFixed(this._toFixed)));
	}

	_handleDownArrowMouseDown(e) {
		console.log('_handleDownArrowMouseDown');
		this._controlsDownArrowStateClass = 'ab-active';
		let value = this._getCurrentValueAsNumber();
		value -= this.props.step;
		document.addEventListener('mouseup', this._handleDownArrowMouseUp, false);
		this._update(this._normalizeValue(value.toFixed(this._toFixed)));
	}

	_handleDownArrowTouchStart(e) {
		console.log('_handleDownArrowTouchStart');
		e.preventDefault(); // tap-highlight related
		this._controlsDownArrowStateClass = 'ab-active';
		let value = this._getCurrentValueAsNumber();
		value -= this.props.step;
		document.addEventListener('touchend', this._handleDownArrowTouchEnd, false);
		document.addEventListener('touchcancel', this._handleDownArrowTouchEnd, false);
		this._update(this._normalizeValue(value.toFixed(this._toFixed)));
	}

	_handleUpArrowMouseUp(e) {
		console.log('_handleUpArrowMouseUp');
		this._controlsUpArrowStateClass = '';
		document.removeEventListener('mouseup', this._handleUpArrowMouseUp, false);
		this.forceUpdate();
	}

	_handleUpArrowTouchEnd(e) {
		console.log('_handleUpArrowTouchEnd');
		e.preventDefault(); // prevent eventual mouse ghost events being fired
		this._controlsUpArrowStateClass = '';
		document.removeEventListener('touchend', this._handleUpArrowTouchEnd, false);
		document.removeEventListener('touchcancel', this._handleUpArrowTouchEnd, false);
		this.forceUpdate();
	}

	_handleDownArrowMouseUp(e) {
		console.log('_handleDownArrowMouseUp');
		this._controlsDownArrowStateClass = '';
		document.removeEventListener('mouseup', this._handleDownArrowMouseUp, false);
		this.forceUpdate();
	}

	_handleDownArrowTouchEnd(e) {
		console.log('_handleDownArrowTouchEnd');
		e.preventDefault(); // prevent eventual mouse ghost events being fired
		this._controlsDownArrowStateClass = '';
		document.removeEventListener('touchend', this._handleDownArrowTouchEnd, false);
		document.removeEventListener('touchcancel', this._handleDownArrowTouchEnd, false);
		this.forceUpdate();
	}

	_handleDraggableMouseDown(e) {
		console.log('_handleDraggableMouseDown');
		this._disableSelection(); // from SelectionDisableableDeco
		// initialize dragStart state
		this._valueOnDragStart = this._getCurrentValueAsNumber();
		this._yPosOnDragStart = parseFloat(e.clientY);
		document.addEventListener('mousemove', this._handleDraggableMouseMove, false);
		document.addEventListener('mouseup', this._handleDraggableMouseUp, false);
	}

	_handleDraggableTouchStart(e) {
		console.log('_handleDraggableTouchStart');
		e.preventDefault(); // tap-highlight related
		this._valueOnDragStart = this._getCurrentValueAsNumber();
		this._yPosOnDragStart = parseFloat(e.touches[0].clientY);
		document.addEventListener('touchmove', this._handleDraggableTouchMove, false);
		document.addEventListener('touchend', this._handleDraggableTouchEnd, false);
		document.addEventListener('touchcancel', this._handleDraggableTouchEnd, false);
	}

	_handleDraggableMouseMove(e) {
		console.log('_handleDraggableMouseMove');
		if (this._dragRunning) { return; }
		this._dragRunning = true;
		requestAnimationFrame(() => {
			// use dragStart state
			let value = this._valueOnDragStart;
			value += (this._yPosOnDragStart - parseFloat(e.clientY)) * this.props.step;
			// value === value guards against NaN
			// which eventually happens when mouseup was triggered before last animationFrame callback
			value === value && this._update(this._normalizeValue(value.toFixed(this._toFixed)));
			this._dragRunning = false;
		});
	}

	_handleDraggableTouchMove(e) {
		console.log('_handleDraggableTouchMove');
		e.preventDefault(); // prevent page scroll
		if (this._dragRunning) { return; }
		this._dragRunning = true;
		requestAnimationFrame(() => {
			let value = this._valueOnDragStart;
			value += (this._yPosOnDragStart - parseFloat(e.touches[0].clientY)) * this.props.step;
			value === value && this._update(this._normalizeValue(value.toFixed(this._toFixed)));
			this._dragRunning = false;
		});
	}

	_handleDraggableMouseUp(e) {
		console.log('_handleDraggableMouseUp');
		document.removeEventListener('mousemove', this._handleDraggableMouseMove, false);
		document.removeEventListener('mouseup', this._handleDraggableMouseUp, false);
		// reset dragStart state
		this._valueOnDragStart = undefined;
		this._yPosOnDragStart = undefined;
	}

	_handleDraggableTouchEnd(e) {
		console.log('_handleDraggableTouchEnd');
		e.preventDefault(); // prevent eventual mouse ghost events being fired
		document.removeEventListener('touchmove', this._handleDraggableTouchMove, false);
		document.removeEventListener('touchend', this._handleDraggableTouchEnd, false);
		document.removeEventListener('touchcancel', this._handleDraggableTouchEnd, false);
		this._valueOnDragStart = undefined;
		this._yPosOnDragStart = undefined;
	}

	// ============================ Helpers ===========================================

	// determines _inputWidth, _wrapperHeight for proper render
	_updateVars() {
		let wrapperComputedStyle = getComputedStyle(this.refs.wrapper);
		let wrapperWidth = parseFloat(wrapperComputedStyle.width);
		let wrapperBorderLRWidth = parseFloat(wrapperComputedStyle.borderLeftWidth) + parseFloat(wrapperComputedStyle.borderRightWidth);
		this._inputWidth = wrapperWidth - wrapperBorderLRWidth - CONTROLLERS_WRAPPER_WIDTH;
		this._wrapperHeight = parseFloat(wrapperComputedStyle.height);
		this._log(`_updateVars: _inputWidth: ${this._inputWidth}, _wrapperHeight: ${this._wrapperHeight}`);
	}

	_getInitialValue() {
		return (this.props.value !== undefined
				? this.props.value
				: this.props.defaultValue !== undefined
				? this.props.defaultValue
				: this.props.start.toString()
		);
	}

	_getCurrentValueAsNumber() {
		let value = parseFloat(this.state.value);
		if (value !== value) value = this.props.start;
		return value
	}

	_normalizeValue(value, validate=false) {
		// validate is to be used for direct user input
		if (validate) {
			if (numberStringAndValueInRangePropType.allowedStrings.indexOf(value) !== -1) return value;
			if (!validateNumberString(value)) return this.state.value;
		}
		// apply start end limits
		let valueNumber = parseFloat(value);
		value = valueNumber < this.props.start ?
				this.props.start.toString() :
				valueNumber > this.props.end ?
					this.props.end.toString() :
					value;
		return value;
	}

	// -----------------------------------------------------------------------------------

	_update(value) {
		if (this.state.value === value) return;

		if (this._isControlledComponent()) {
			this._emitValueChangeEvent(value);
		} else {
			this._setValueStateAndEmitValueChangedEvent(value);
		}
	}

	_emitValueChangeEvent(value) {
		if (this.props.onChange === undefined) return;
		this._log(`_emitValueChangeEvent => value: ${value}`);
		this.props.onChange(value);
	}

	_setValueState(value, callback = null) {
		if (this.state.value === value) return;
		this._log(`_setValueState => from: ${this.state.value} to: ${value}`);
		this.setState({value: value}, callback);
	}

	_setValueStateAndEmitValueChangedEvent(value) {
		this._setValueState(value, () => {
			this._emitValueChangeEvent(value);
		});
	}

	// ============================ Render =============================================

	render() {
		let inputHandlers = {};
		let controlsUpArrowHandlers = {};
		let controlsDownArrowHandlers = {};
		let controlsDragHandlers = {};
		if (!this.props.disabled && !this.props.readonly) {
			inputHandlers = {
				onChange: this._handleOnChange,
				onWheel: this._handleMouseWheel
			};
			controlsUpArrowHandlers = {
				onMouseDown: this._handleUpArrowMouseDown,
				onTouchStart: this._handleUpArrowTouchStart,
			};
			controlsDownArrowHandlers = {
				onMouseDown: this._handleDownArrowMouseDown,
				onTouchStart: this._handleDownArrowTouchStart,
			};
			controlsDragHandlers = {
				onMouseDown: this._handleDraggableMouseDown,
				onTouchStart: this._handleDraggableTouchStart,
			};
		}

		// also let props.style pass through
		let wrapperStyle = Object.assign((this.props.style || {}), {
			position: 'relative',
			display: 'block', // inline-block will add some default space
			opacity: this.props.disabled ? 0.5 : 1,
		});

		// constrain height within 20..50 px range
		if (this._style('height')) {
			let height = parseFloat(this._style('height'));
			wrapperStyle['height'] = height < 20 ? '20px' : height > 50 ? '50px' : this._style('height');
		}

		let inputStyle = Object.assign({}, {
			position: 'absolute',
			top: '0px',
			left: '0px',
			height: '100%',
			width: this._inputWidth,
			border: 'none',
			padding: '0px 4px 0px 4px',
			cursor: this.props.disabled ? 'not-allowed' : 'text',
		});

		// delegate some css rules to input
		['fontSize', 'fontWeight', 'fontStyle'].forEach((prop) => {
			this._style(prop) && (inputStyle[prop] = this._style(prop))
		});

		let controlsWrapperStyle = Object.assign({}, {
			cursor: this.props.disabled ? 'not-allowed' : 'pointer',
			position: 'absolute',
			top: '0px',
			right: '0px',
			width: CONTROLLERS_WRAPPER_WIDTH,
			height: '100%',
			borderLeft: '1px solid transparent',
		});

		// controls style
		let controlsArrowDivHeightPercent = 40;
		let controlsMiddleDivHeightPercent = 20;
		let controlsArrowBorderWidth = 4; // hardcoded in utils.scss
		let controlsArrowPaddingTop = (this._wrapperHeight/100) * controlsArrowDivHeightPercent/2 - controlsArrowBorderWidth/2;
		let controlsMiddleDivCursor = this.props.disabled || this.props.readOnly ? 'inherit' : 'row-resize';

		return (
			<div className={`${this.props.className ? this.props.className : ''} ab ab-input-number ab-no-tap`}
				 ref="wrapper"
				 style={wrapperStyle}>
				<input type="text"
					   name={this.props.name}
					   value={this.state.value}
					   disabled={this.props.disabled}
					   readOnly={this.props.readOnly}
					   style={inputStyle}
					{...inputHandlers} />
				<div ref="controls"
					 className="ab-input-number-controls"
					 style={controlsWrapperStyle}
					{...controlsDragHandlers}>
					<div style={{height: `${controlsArrowDivHeightPercent}%`, paddingLeft: '3px', paddingTop: controlsArrowPaddingTop}}     {...controlsUpArrowHandlers}  ><div className={`ab-arrow-up ${this._controlsUpArrowStateClass}`} /></div>
					<div style={{height: `${controlsMiddleDivHeightPercent}%`, cursor: controlsMiddleDivCursor}} className="ab-input-number-middle-control"               ></div>
					<div style={{height: `${controlsArrowDivHeightPercent}%`, paddingLeft: '3px', paddingTop: controlsArrowPaddingTop - 1}} {...controlsDownArrowHandlers}><div className={`ab-arrow-down ${this._controlsDownArrowStateClass}`} /></div>
				</div>
			</div>
		);
	}
}

// ▴ ▾

InputNumber = GenericDeco(InputNumber);
InputNumber = SelectionDisableableDeco(InputNumber);

export default InputNumber;
