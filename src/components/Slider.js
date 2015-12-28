'use strict';

import React from 'react';
import Style from '../style';
import MixinGenericComponent from '../mixins/mixin_generic_component';

/*
TODO: make tests
*/

// ============================ Custom Validators =================================

function startEndPropType (props, propName, componentName) {
    let error = React.PropTypes.number(props, propName, componentName);
    if (error !== null) return error;

    if (props.start >= props.end) {
        let errorMsg = (propName === 'start') ? 'start should be less than end' : 'end should be greater than start';
        return new Error(errorMsg);
    }
}

function valueInRangePropType (props, propName, componentName) {
    let error = React.PropTypes.number(props, propName, componentName);
    if (error !== null) return error;

    let value = props[propName];
    if (value < props.start || value > props.end) {
        return new Error(propName + ' should be within the range specified by start and end');
    }
}

// =============================== Component =============================

const Horizontal = React.createClass({

    // ======================= Vars ===================================

    _outerWidth: 0,
    _offsetLeft: 0,

    // ======================= Mixins ===================================

    mixins: [MixinGenericComponent],

    // ======================= React APIs ===================================

    propTypes: {
        // optional with defaults
        start: startEndPropType,
        end: startEndPropType,
        size:	React.PropTypes.string,
        step: React.PropTypes.number,

        // optional no defaults
        value: valueInRangePropType,
        defaultValue: valueInRangePropType,
        onChange: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            start: -1,
            end: 1,
            size: '100%',
            step: null
        };
    },

    getInitialState() {
        return {
            percent: 0
        };
    },

    componentDidMount() {
        this._log(`componentDidMount`);
        this._updateVars();
        let value = this._getValue();
        let percent = this._valueToPercent(value);
        this._setPercentState(percent);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return nextState.percent !== this.state.percent;
    },

    componentWillReceiveProps(nextProps) {
        if (this._isControlledComponent()) {
            let percent = this._valueToPercent(nextProps.value);
            this._log(`componentWillReceiveProps => nextProps: ${JSON.stringify(nextProps)}`);
            this._setPercentState(percent);
        }
    },

    render() {
        let innerWidth = this._outerWidth * this.state.percent;

        this._log(`render => state: ${JSON.stringify(this.state)} | props: ${JSON.stringify(this.props)}`);

        let backgroundStyle = Object.assign({}, Style.horizontalSlider.background, {
            width: this.props.size
        });

        let foregroundStyle = Object.assign({}, Style.horizontalSlider.foreground, {
            width: `${innerWidth}px`
        });

        return (
            <div>
                <div ref="outer" style={backgroundStyle} onClick={this.handleOnClick}>
                    <div style={foregroundStyle}></div>
                </div>
            </div>
        );
    },

    // ============================= Handlers ========================================

    handleOnClick(e) {
        let percent = this._eventToPercent(e);
        let newValue = this._percentToValue(percent);
        if (!this._isControlledComponent()) {
            this._setPercentStateAndEmitValueChangedEvent(percent, newValue);
        } else {
            this._emitValueChangeEvent(newValue);
        }
    },

    // ============================ Helpers ===========================================

    _updateVars() {
        let boundingClientRect = this.refs.outer.getBoundingClientRect();

        this._offsetLeft = parseInt(boundingClientRect.left);
        this._outerWidth = parseInt(boundingClientRect.width);
    },

    _eventToPercent(e) {
        let positionX = e.pageX - this._offsetLeft;
        return parseFloat((positionX/this._outerWidth).toFixed(2));
    },

    _valueToPercent(value) {
        let range = this.props.end - this.props.start;
        let position = value - this.props.start;
        return parseFloat((position/range).toFixed(2));
    },

    _percentToValue(percent) {
        let range = this.props.end - this.props.start;
        return parseFloat((range * percent + this.props.start).toFixed(2));
    },

    _getValue() {
        return (this.props.value !== undefined
                ? this.props.value
                : this.props.defaultValue !== undefined
                    ? this.props.defaultValue
                    : this.props.start
                );
    },

    _emitValueChangeEvent(value) {
        if(this.props.onChange !== undefined) {
            this._log(`_emitValueChangeEvent => value: ${value}`);
            this.props.onChange(value);
        }
    },

    _setPercentState(percent, callback=null) {
        if (this.state.percent === percent) { return; }
        this._log(`_setPercentState => percent from: ${this.state.percent} to: ${percent}`);
        this.setState({percent: percent}, callback);
    },

    _setPercentStateAndEmitValueChangedEvent(percent, value) {
        this._setPercentState(percent, () => {
            this._emitValueChangeEvent(value);
        });
    }
});

export default {
    Horizontal
};