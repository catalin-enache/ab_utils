'use strict';

import React from 'react';
import Style from '../style';

var MixinGenericComponent = {
    propTypes: {
        // required
        name: React.PropTypes.string.isRequired,

        // optional with defaults
        debug: React.PropTypes.bool,

        // optional no defaults
        cStyle: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            debug: false,
        };
    },

    componentDidMount() {
        this.isMounted = true;
    },

    componentWillUnmount() {
        this.isMounted = false;
    },

    _log(msg) {
        this.props.debug && console.log(`${this.props.name} > ${msg}`);
    },

    _isControlledComponent() {
        return this.props.value !== undefined;
    },

    _style(key) {
        if (!this.__style) {
            this.__style = Object.assign({}, Style[this.constructor.displayName], (this.props.cStyle || {}));
        }
        return this.__style[key];
    }
};

export default MixinGenericComponent;