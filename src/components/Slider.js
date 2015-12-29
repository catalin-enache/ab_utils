'use strict';

import React from 'react';
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

const Slider = React.createClass({

    // ======================= Vars ===================================

    _outerWidth: 0,
    _outerHeight: 0,
    _offsetLeft: 0,
    _offsetTop: 0,

    // ======================= Mixins ===================================

    mixins: [MixinGenericComponent],

    // ======================= React APIs ===================================

    propTypes: {
        // optional with defaults
        start: startEndPropType,
        end: startEndPropType,
        step: React.PropTypes.number,
        orientation: React.PropTypes.string,

        // optional no defaults
        value: valueInRangePropType,
        defaultValue: valueInRangePropType,
        onChange: React.PropTypes.func,
    },

    getDefaultProps() {
        return {
            start: -1,
            end: 1,
            step: null,
            orientation: 'horizontal'
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

        this._log(`render => state: ${JSON.stringify(this.state)} | props: ${JSON.stringify(this.props)}`);

        if (this.props.orientation == 'horizontal') {

            let innerWidth = this._outerWidth * this.state.percent;

            var wrapperStyle =  {
                width: '100%'
            };

            var backgroundStyle = {
                width: this._style('size'),
                height: this._style('thickness'),
            };

            var foregroundStyle = {
                width: `${innerWidth}px`,
                height: this._style('thickness'),
            };
        } else {

            let innerHeight = this._outerHeight * this.state.percent;

            var wrapperStyle =  {
                height: '100%'
            };

            var backgroundStyle = {
                height: this._style('size'),
                width: this._style('thickness'),
            };

            var foregroundStyle = {
                height: `${innerHeight}px`,
                width: this._style('thickness'),
            };
        }

        backgroundStyle = Object.assign(backgroundStyle, {
            cursor: 'pointer',
            backgroundColor: this._style('bgColor'),
        });

        foregroundStyle = Object.assign(foregroundStyle, {
            backgroundColor: this._style('fgColor'),
        });

        return (
            <div style={wrapperStyle}>
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

        this._outerWidth = parseInt(boundingClientRect.width);
        this._outerHeight = parseInt(boundingClientRect.height);
        this._offsetLeft = parseInt(boundingClientRect.left);
        this._offsetTop = parseInt(boundingClientRect.top);

        this._log(`_updateVars: _outerWidth: ${this._outerWidth} _outerHeight: ${this._outerHeight} _offsetLeft: ${this._offsetLeft} _offsetTop: ${this._offsetTop} `)
    },

    _eventToPercent(e) {
        if (this.props.orientation == 'horizontal') {
            let positionX = e.pageX - this._offsetLeft;
            return parseFloat((positionX/this._outerWidth).toFixed(2));
        } else {
            let positionY = e.pageY - this._offsetTop;
            return parseFloat((positionY/this._outerHeight).toFixed(2));
        }
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
    },
});

export default Slider;