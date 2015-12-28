'use strict';

import React from 'react';

var MixinGenericComponent = {
    propTypes: {
        // required
        name: React.PropTypes.string.isRequired,

        // optional with defaults
        debug: React.PropTypes.bool
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
};

export default MixinGenericComponent;