'use strict';

import React from 'react';

export function valueXorDefaultValue(props) {
	if (props.value !== undefined && props.defaultValue !== undefined) {
		return new Error('Component should have either value or defaultValue, not both.');
	}
}

export function valueInRange(value, props) {
	return props.start <= value && value <= props.end;
}

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


