'use strict';

import React from 'react';
import GenericComponent from './generic_component';
import GenericDeco from '../decorators/generic_deco';
import SelectionDisableableDeco from '../decorators/selection_disableable_deco';

const displayName = 'InputText';

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

class InputText extends GenericComponent {

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
			value: this._getInitialValue(),
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

	componentDidMount() {
		this._log(`componentDidMount`);
	}

	// ============================= Handlers ========================================

	_handleOnChange(e) {
		this._log(`_handleOnChange ${e.target.value}`);
		this._update(e.target.value);
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
		if (!this.props.disabled && !this.props.readonly) {
			inputHandlers = {
				onChange: this._handleOnChange,
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
			width: '100%',
			border: 'none',
			padding: '0px 4px 0px 4px',
			cursor: this.props.disabled ? 'not-allowed' : 'text',
		});

		// delegate some css rules to input
		['fontSize', 'fontWeight', 'fontStyle'].forEach((prop) => {
			this._style(prop) && (inputStyle[prop] = this._style(prop))
		});

		return (
			<div className={`${this.props.className ? this.props.className : ''} ab ab-input-text ab-no-tap`}
				 ref="wrapper"
				 style={wrapperStyle}>
				<input type="text"
					   name={this.props.name}
					   value={this.state.value}
					   disabled={this.props.disabled}
					   readOnly={this.props.readOnly}
					   style={inputStyle}
					{...inputHandlers} />
			</div>
		);
	}
}

InputText = GenericDeco(InputText);
InputText = SelectionDisableableDeco(InputText);

export default InputText;
