'use strict';

import React from 'react';
import GenericComponent from './generic_component';
import GenericDeco from '../decorators/generic_deco';
import {getWheelDelta} from '../common/helpers';
import {startEndPropType, valueInRangePropType, stepPropType} from '../common/validators';

const displayName = 'Number';

const propTypes = {
	// optional with defaults
	start: startEndPropType,
	end: startEndPropType,
	step: stepPropType,
	disabled: React.PropTypes.bool,
	readOnly: React.PropTypes.bool,

	// optional no defaults
	value: valueInRangePropType, // monitoring change
	defaultValue: valueInRangePropType,
	onChange: React.PropTypes.func
};

const defaultProps = {
	start: 0,
	end: 1,
	step: 0.01,
	disabled: false,
	readOnly: false
};

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

		this.state = {
			value: this._getValue()
		};

		this._handleOnChange = this._handleOnChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		// we are listening only for value change
		if (this._isControlledComponent()) {
			this._log(`componentWillReceiveProps => nextProps: ${JSON.stringify(nextProps)}`);
			this._setValueState(nextProps.value);
		}
	}

	// ============================= Handlers ========================================

	_handleOnChange(e) {
		this._log(`_handleOnChange ${e.target.value}`);
		this._update(e);
	}

	// ============================ Helpers ===========================================

	_getValue() {
		return (this.props.value !== undefined
				? this.props.value
				: this.props.defaultValue !== undefined
				? this.props.defaultValue
				: this.props.start
		);
	}

	// -----------------------------------------------------------------------------------

	_update(e) {
		let value = parseFloat(e.target.value);

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

		let handlers = {};
		if (!this.props.disabled && !this.props.readonly) {
			handlers = {
				onChange: this._handleOnChange
			}
		}

		return (
			<input type="text"
				   className={`${this.props.className ? this.props.className : ''} input-number`}
				   name={this.props.name}
				   value={this.state.value}
				   disabled={this.props.disabled}
				   readOnly={this.props.readOnly}
				   {...handlers} />
		);
	}
}

InputNumber = GenericDeco(InputNumber);

export default InputNumber;
