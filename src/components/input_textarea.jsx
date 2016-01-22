'use strict';

import React from 'react';
import GenericComponent from './generic_component';
import InputSlider from './input_slider';
import GenericDeco from '../decorators/generic_deco';
import SelectionDisableableDeco from '../decorators/selection_disableable_deco';
import {getWheelDelta} from '../common/helpers';

const displayName = 'InputTextarea';

const propTypes = {
	// optional with defaults
	disabled: React.PropTypes.bool,
	readOnly: React.PropTypes.bool,

	// optional no defaults
	value: React.PropTypes.string, // monitoring change
	defaultValue: React.PropTypes.string,
	onChange: React.PropTypes.func
};

const defaultProps = {
	disabled: false,
	readOnly: false
};

const PADDING_RIGHT_BOTTOM = 8;

class InputTextarea extends GenericComponent {

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

		this._dragRunning = false;
		this._onDragStartScrollTopPercentAmount = undefined;
		this._onDragStartScrollLeftPercentAmount = undefined;
		this._onDragStartXPosition = undefined;
		this._onDragStartYPosition = undefined;

		this.state = {
			value: this._getInitialValue(),
			verticalSliderValue: 0,
			horizontalSliderValue: 0,
			textareaWrapperWidth: 0,
			textareaWrapperHeight: 0,
			textareaScrollableHeight: 0,
			textareaScrollableWidth: 0,
		};

		this._handleOnChange = this._handleOnChange.bind(this);
		this._handleOnKeyDown = this._handleOnKeyDown.bind(this);
		this._handleVerticalSliderChange = this._handleVerticalSliderChange.bind(this);
		this._handleHorizontalSliderChange = this._handleHorizontalSliderChange.bind(this);
		this._handleTouchStart = this._handleTouchStart.bind(this);
		this._handleTouchMove = this._handleTouchMove.bind(this);
		this._handleTouchEnd = this._handleTouchEnd.bind(this);
		this._handleMouseWheel = this._handleMouseWheel.bind(this);
	}

	componentDidMount() {
		this._log(`componentDidMount`);
		this._updateVars();
	}

	componentWillReceiveProps(nextProps) {
		// we are listening only for value change
		if (this._isControlledComponent()) {
			this._log(`componentWillReceiveProps => nextProps: ${JSON.stringify(nextProps)}`);
			this._setValueState(nextProps.value, () => {
				this._updateVars(); // update scrolls when text value is received in props
			});
		}
	}

	// ============================= Handlers ========================================

	_handleOnChange(e) {
		this._log(`_handleOnChange ${e.target.value}`);
		this._update(e.target.value);
	}

	_handleOnKeyDown(e) {
		// when keyboard arrows are pressed they eventually make textarea auto scroll
		// if textarea was auto scroll we have to make sliders aware by changing their value
		this._updateVars();
	}

	_handleMouseWheel(e) {
		e.preventDefault();
		let delta = getWheelDelta(e);
		let newPercent = this.state.verticalSliderValue + delta * 0.01;
		newPercent = newPercent > 1 ? 1 : newPercent < 0 ? 0 : newPercent;
		this._scrollVertically(newPercent);
	}


	_handleTouchStart(e) {
		this._updateVars();
		document.addEventListener('touchmove', this._handleTouchMove, false);
		document.addEventListener('touchend', this._handleTouchEnd, false);
		document.addEventListener('touchcancel', this._handleTouchEnd, false);

		this._onDragStartScrollTopPercentAmount = this.state.verticalSliderValue;
		this._onDragStartScrollLeftPercentAmount = this.state.horizontalSliderValue;
		this._onDragStartXPosition = e.touches[0].clientX;
		this._onDragStartYPosition = e.touches[0].clientY;
	}

	_handleTouchMove(e) {
		e.preventDefault(); // prevent page scroll
		if (this._dragRunning) { return; }
		this._dragRunning = true;
		requestAnimationFrame(() => {
			let currentYDistance = e.touches[0].clientY - this._onDragStartYPosition;
			let currentXDistance = -e.touches[0].clientX + this._onDragStartXPosition;

			let verticalPercent = this._onDragStartScrollTopPercentAmount + currentYDistance / this.state.textareaScrollableHeight;
			let horizontalPercent = this._onDragStartScrollLeftPercentAmount + currentXDistance / this.state.textareaScrollableWidth;

			verticalPercent = verticalPercent > 1 ? 1 : verticalPercent < 0 ? 0 : verticalPercent;
			horizontalPercent = horizontalPercent > 1 ? 1 : horizontalPercent < 0 ? 0 : horizontalPercent;

			verticalPercent === verticalPercent && this._scrollVertically(verticalPercent);
			horizontalPercent === horizontalPercent && this._scrollHorizontally(horizontalPercent);
			this._dragRunning = false;
		});
	}

	_handleTouchEnd(e) {
		document.removeEventListener('touchmove', this._handleTouchMove, false);
		document.removeEventListener('touchend', this._handleTouchEnd, false);
		document.removeEventListener('touchcancel', this._handleTouchEnd, false);

		this._onDragStartScrollTopPercentAmount = undefined;
		this._onDragStartScrollLeftPercentAmount = undefined;
		this._onDragStartXPosition = undefined;
		this._onDragStartYPosition = undefined;
	}

	_handleVerticalSliderChange(percent) {
		this._scrollVertically(percent);
	}

	_handleHorizontalSliderChange(percent) {
		this._scrollHorizontally(percent);
	}

	// ============================ Helpers ===========================================

	_getInitialValue() {
		return (this.props.value !== undefined
				? this.props.value
				: this.props.defaultValue !== undefined
				? this.props.defaultValue
				: ''
		);
	}

	/*
	* some dom measurements followed by setState
	* */
	_updateVars() {
		let textareaClientHeight = this.refs.textarea.clientHeight;
		let textareaClientWidth = this.refs.textarea.clientWidth;
		let textareaScrollHeight = this.refs.textarea.scrollHeight;
		let textareaScrollWidth = this.refs.textarea.scrollWidth;
		let textareaScrollTop = this.refs.textarea.scrollTop;
		let textareaScrollLeft = this.refs.textarea.scrollLeft;
		let textareaWrapperWidth = this.refs.textareaWrapper.clientWidth;
		let textareaWrapperHeight = this.refs.textareaWrapper.clientHeight;

		let textareaScrollableHeight = textareaScrollHeight - textareaClientHeight;
		textareaScrollableHeight = textareaScrollableHeight > 0 ? textareaScrollableHeight : 0;
		let textareaScrollableWidth = textareaScrollWidth - textareaClientWidth;
		textareaScrollableWidth = textareaScrollableWidth > 0 ? textareaScrollableWidth : 0;

		let verticalSliderValue = textareaScrollableHeight > 0 ? textareaScrollTop / textareaScrollableHeight : this.state.verticalSliderValue;
		let horizontalSliderValue = textareaScrollableWidth > 0 ? textareaScrollLeft / textareaScrollableWidth : this.state.horizontalSliderValue;

		this._log(`_updateVars: textareaWrapperWidth: ${textareaWrapperWidth}
		textareaWrapperHeight: ${textareaWrapperHeight}
		verticalSliderValue: ${verticalSliderValue}
		horizontalSliderValue: ${horizontalSliderValue}
		textareaScrollableHeight: ${textareaScrollableHeight}
		textareaScrollableWidth: ${textareaScrollableWidth}`);

		this.setState({
			verticalSliderValue: 1 - verticalSliderValue,
			horizontalSliderValue: horizontalSliderValue,
			textareaWrapperWidth: textareaWrapperWidth,
			textareaWrapperHeight: textareaWrapperHeight,
			textareaScrollableHeight: textareaScrollableHeight,
			textareaScrollableWidth: textareaScrollableWidth,
		});
	}

	_scrollVertically(percent) {
		this.refs.textarea.scrollTop = this.state.textareaScrollableHeight - percent * this.state.textareaScrollableHeight;
		this.setState({verticalSliderValue: percent});
	}

	_scrollHorizontally(percent) {
		this.refs.textarea.scrollLeft = percent * this.state.textareaScrollableWidth;
		this.setState({horizontalSliderValue: percent});
	}

	// -----------------------------------------------------------------------------------

	_update(value) {
		if (this.state.value === value) return;

		if (this._isControlledComponent()) {
			this._emitValueChangeEvent(value);
		} else {
			this._updateVars(); // make sliders aware of changes in dom measurements when pasting/cutting test
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

		this._log(`render => state: ${JSON.stringify(this.state)} | props: ${JSON.stringify(this.props)}`);

		let inputHandlers = {};
		let verticalSliderHandlers = {};
		let horizontalSliderHandlers = {};
		if (!this.props.disabled && !this.props.readonly) {
			inputHandlers = {
				onChange: this._handleOnChange,
				onKeyDown: this._handleOnKeyDown,
				onTouchStart: this._handleTouchStart,
				onWheel: this._handleMouseWheel,
			};

			verticalSliderHandlers = {
				onChange: this._handleVerticalSliderChange
			};

			horizontalSliderHandlers = {
				onChange: this._handleHorizontalSliderChange
			};
		}

		// also let props.style pass through
		let wrapperStyle = Object.assign((this.props.style || {}), {
			position: ['absolute', 'relative'].indexOf(this._style('position')) !== -1 ? this._style('position') : 'relative',
			display: 'block', // inline-block will add some default space
			opacity: this.props.disabled ? 0.5 : 1,
			cursor: this.props.disabled ? 'not-allowed' : 'text',
		});

		// constrain height within 20..50 px range
		if (this._style('height')) {
			let height = parseFloat(this._style('height'));
			wrapperStyle['height'] = height < 50 ? '50px' : this._style('height');
		}

		let textareaWrapperStyle = Object.assign({}, {
			position: 'absolute',
			top: '0px',
			left: '0px',
			right: `${PADDING_RIGHT_BOTTOM}px`,
			bottom: `${PADDING_RIGHT_BOTTOM}px`,
			padding: '6px',
		});

		let inputStyle = Object.assign({}, {
			width: '100%',
			height: '100%',
			border: 'none',
			backgroundColor: 'transparent',
			resize: 'none',
			msOverflowStyle: 'none',
			whiteSpace: 'pre',
			wordWrap: 'normal',
			overflow: 'hidden',
		});

		// delegate some style rules to input
		['fontSize', 'fontWeight', 'fontStyle'].forEach((prop) => {
			this._style(prop) && (inputStyle[prop] = this._style(prop))
		});

		let horizontalSliderWrapperStyle = {
			position: 'absolute',
			bottom: '0px',
			left: '0px',
			width: this.state.textareaWrapperWidth,
			height: `${PADDING_RIGHT_BOTTOM}px`,
		};

		let horizontalSliderStyle = {
			width: '100%',
			height: '100%',
			boxShadow: 'none',
		};

		let verticalSliderWrapperStyle = {
			position: 'absolute',
			top: '0px',
			right: '0px',
			width: `${PADDING_RIGHT_BOTTOM}px`,
			height: this.state.textareaWrapperHeight,
		};

		let verticalSliderStyle = {
			width: '100%',
			height: '100%',
			boxShadow: 'none',
		};

		// delegate some style rules to sliders
		if (this._style('sliderBackgroundColor')) {
			horizontalSliderStyle['backgroundColor'] = verticalSliderStyle['backgroundColor'] = this._style('sliderBackgroundColor');
		}

		if (this._style('sliderForegroundColor')) {
			horizontalSliderStyle['foregroundColor'] = verticalSliderStyle['foregroundColor'] = this._style('sliderForegroundColor');
		}

		let VSlider = <span />;
		let HSlider = <span />;


		if (this.state.textareaScrollableHeight) {
			VSlider = <InputSlider
				name={`${this.props.name}_vertical_slider`}
				ref="verticalSlider"
				start={0} end={1} value={this.state.verticalSliderValue}
				orientation="vertical"
				style={verticalSliderStyle}
				debug={this.props.debug}
				disabled={this.props.disabled || this.props.readOnly}
				{...verticalSliderHandlers} />;
		}

		if (this.state.textareaScrollableWidth) {
			HSlider = <InputSlider
				name={`${this.props.name}_horizontal_slider`}
				ref="horizontalSlider"
				start={0} end={1} value={this.state.horizontalSliderValue}
				orientation="horizontal"
				style={horizontalSliderStyle}
				debug={this.props.debug}
				disabled={this.props.disabled || this.props.readOnly}
				{...horizontalSliderHandlers}/>;
		}

		return (
			<div className={`${this.props.className ? this.props.className : ''} ab ab-input-textarea ab-no-tap`}
				 ref="wrapper"
				 style={wrapperStyle}>

				<div className="ab-input-textarea-wrapper"
					 ref="textareaWrapper"
					 style={textareaWrapperStyle}>
					<textarea
						ref="textarea"
						className="ab-input-textarea-field"
						name={this.props.name}
						value={this.state.value}
						disabled={this.props.disabled}
						readOnly={this.props.readOnly}
						style={inputStyle}
						{...inputHandlers} />
				</div>

				<div style={horizontalSliderWrapperStyle}>
					{ HSlider }
				</div>

				<div style={verticalSliderWrapperStyle}>
					{ VSlider }
				</div>
			</div>
		);
	}
}

InputTextarea = GenericDeco(InputTextarea);
InputTextarea = SelectionDisableableDeco(InputTextarea);

export default InputTextarea;
