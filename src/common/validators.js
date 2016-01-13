'use strict';

import React from 'react';
import {trim} from './helpers';

function valueXorDefaultValue(props) {
	if (props.value !== undefined && props.defaultValue !== undefined) {
		return new Error('Component should have either value or defaultValue, not both.');
	}
}

function valueInRange(value, props) {
	return props.start <= value && value <= props.end;
}

export function validateNumberString(value) {
	return validateNumberString.regex1.test(value) || validateNumberString.regex2.test(value);
}
validateNumberString.regex1 = /^[-+]?\d*\.?\d+$/;
validateNumberString.regex2 = /^[-+]?\d+\.?\d*$/;

export function startEndPropType(props, propName, componentName, location) {
	let error = React.PropTypes.number(props, propName, componentName, location);
	if (error !== null) return error;

	if (props.start >= props.end || props.end - props.start === 0) {
		let errorMsg = (propName === 'start') ? 'start should be less than end' : 'end should be greater than start';
		return new Error(errorMsg);
	}
}

export function valueInRangePropType(props, propName, componentName, location) {
	let error = React.PropTypes.number(props, propName, componentName, location);
	if (error !== null) return error;

	let valueOrDefaultValueError = valueXorDefaultValue(props);
	if (valueOrDefaultValueError) return valueOrDefaultValueError;

	let value = props[propName];
	if (value !== undefined && !valueInRange(value, props)) {
		return new Error(propName + ' should be within the range specified by start and end');
	}
}

export function stepPropType(props, propName, componentName, location) {
	let error = React.PropTypes.number(props, propName, componentName, location);
	if (error !== null) {
		return error;
	}

	let value = props[propName];

	if (value <= 0) {
		return new Error(propName + ` must be greater than 0`);
	}

	let range = props.end - props.start;
	let stepsNum = range / value;

	if (stepsNum !== parseInt(stepsNum)) {
		return new Error(propName + ` (${value}) does not fit in range ${range} between (${props.start}..${props.end})`);
	}
}

export function numberStringPropType(props, propName, componentName, location) {
	let error = React.PropTypes.string(props, propName, componentName, location);
	if (error !== null) return error;
	let value = props[propName];
	if (value === undefined) return;
	value = trim(value);
	if (!validateNumberString(value)) {
		return new Error(propName + ` (${value}) must be a valid number representation`);
	}
}

export function numberStringAndValueInRangePropType(props, propName, componentName, location) {
	if (value === undefined) return;
	let value = props[propName];
	value = trim(value);
	if (['', '+', '-','-.','+.'].indexOf(value)) return;

	let error = numberStringPropType(props, propName, componentName, location);
	if (error) return error;

	props = Object.assign({}, props, {[`${propName}`]: parseFloat(value)});
	error = valueInRangePropType(props, propName, componentName, location);
	if (error) return error;
}




