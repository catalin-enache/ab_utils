'use strict';

import React from 'react';
import Style from '../style';

const propTypes = {
	// required
	name: React.PropTypes.string.isRequired,

	// optional with defaults
	debug: React.PropTypes.bool
};

const defaultProps = {
	debug: false
};

class GenericComponent extends React.Component {

	static get propTypes() {
		return propTypes;
	}

	static get defaultProps() {
		return defaultProps;
	}

	_log(msg) {
		this.props.debug && console.log(`${this.props.name} > ${msg}`);
	}

	_isControlledComponent() {
		return this.props.value !== undefined;
	}

	// for Style[this.constructor.displayName] to work the child must specify its value
	_style(key, _default) {
		if (!this.__style) {
			this.__style = Object.assign({}, Style[this.constructor.displayName], (this.props.style || {}));
		}
		return this.__style[key] !== undefined ? this.__style[key] : _default;
	}
}

export default GenericComponent;

