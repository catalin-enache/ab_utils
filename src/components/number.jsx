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

	// optional no defaults
	value: valueInRangePropType, // monitoring change
	defaultValue: valueInRangePropType,
	onChange: React.PropTypes.func
};

const defaultProps = {
	start: -1,
	end: 1,
	step: 0.01,
	disabled: false
};

class Number extends GenericComponent {

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


	}

	render() {
		return (
			<input type="text" name='one' value={9} disabled={this.props.disabled} />
		);
	}
}


Number = GenericDeco(Number);

export default Number;
