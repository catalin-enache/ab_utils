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
    if (value !== undefined && !valueInRange(value, props)) {
        return new Error(propName + ' should be within the range specified by start and end');
    }
}

// =============================== Helpers ===============================

function valueInRange(value, props) {
    return props.start <= value && value <= props.end;
}

// =============================== Component =============================

const DEFAULT_SIZE = '100px';
const DEFAULT_THICKNESS = '5px';

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
        disabled: React.PropTypes.bool,

        // optional no defaults
        value: valueInRangePropType,
        defaultValue: valueInRangePropType,
        onChange: React.PropTypes.func
    },

    /*
    additional API:
        style: {bgColor: 'cssColorValue', fgColor: 'cssColorValue'}
        any other style property is passed through when not intentionally overridden
    */

    getDefaultProps() {
        return {
            start: -1,
            end: 1,
            step: null,
            orientation: 'horizontal',
            disabled: false
        };
    },

    getInitialState() {
        return {
            percent: 0,
            value: this._getValue()
        };
    },

    componentDidMount() {
        this._log(`componentDidMount`);
        this._updateVars();
        let value = this._getValue();
        let percent = this._valueToPercent(value);
        this._setPercentValueState(percent, value);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return nextState.percent !== this.state.percent;
    },

    componentWillReceiveProps(nextProps) {
        if (this._isControlledComponent()) {
            this._log(`componentWillReceiveProps => nextProps: ${JSON.stringify(nextProps)}`);
            let percent = this._valueToPercent(nextProps.value);
            this._setPercentValueState(percent, nextProps.value);
        }
    },

    render() {

        this._log(`render => state: ${JSON.stringify(this.state)} | props: ${JSON.stringify(this.props)}`);

        if (this.props.orientation == 'horizontal') {

            let innerWidth = this._outerWidth * this.state.percent;

            var backgroundStyle = {
                width: this._style('width', DEFAULT_SIZE),
                height: this._style('height', DEFAULT_THICKNESS)
            };

            var foregroundStyle = {
                width: `${innerWidth}px`,
                height: '100%'
            };
        } else {

            let innerHeight = this._outerHeight * this.state.percent;

            var backgroundStyle = {
                height: this._style('height', DEFAULT_SIZE),
                width: this._style('width', DEFAULT_THICKNESS)
            };

            var foregroundStyle = {
                height: `${innerHeight}px`,
                width: '100%'
            };
        }

        // also let props.style pass through
        backgroundStyle = Object.assign((this.props.style || {}), backgroundStyle, {
            cursor: this.props.disabled ? 'not-allowed' : 'pointer',
            backgroundColor: this._style('bgColor')
        });

        this.props.disabled && (backgroundStyle['opacity'] = 0.5);

        foregroundStyle = Object.assign(foregroundStyle, {
            backgroundColor: this._style('fgColor')
        });

        return (
            <div ref="outer" style={backgroundStyle} onMouseDown={this._handleMouseDown}>
                <div style={foregroundStyle}></div>
                <input type="hidden" name={this.props.name} value={this.state.value} disabled={this.props.disabled} />
            </div>
        );
    },

    // ============================= Handlers ========================================

    _handleMouseDown(e) {
        if (this.props.disabled) { return; }
        document.addEventListener('mousemove', this._handleMouseMove, false);
        document.addEventListener('mouseup', this._handleMouseUp, false);
        this._update(e);
    },

    _handleMouseMove(e) {
        if (this._dragRunning) { return; }
        this._dragRunning = true;
        requestAnimationFrame(() => {
            this._update(e);
            this._dragRunning = false;
        });
    },

    _handleMouseUp(e) {
        document.removeEventListener('mousemove', this._handleMouseMove, false);
        document.removeEventListener('mouseup', this._handleMouseUp, false);
        this._update(e);
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

    _update(e) {
        let percent = this._eventToPercent(e);
        let newValue = this._percentToValue(percent);
        let start = this.props.start;
        let end = this.props.end;

        newValue = newValue < start ? start : newValue > end ? end : newValue;
        percent = percent < 0 ? 0 : percent > 1 ? 1 : percent;

        if (this._isControlledComponent()) {
            this._emitValueChangeEvent(newValue);
        } else {
            this._setPercentValueStateAndEmitValueChangedEvent(percent, newValue);
        }
    },

    _emitValueChangeEvent(value) {
        if (this.state.value === value || this.props.onChange === undefined) { return; }
        this._log(`_emitValueChangeEvent => value: ${value}`);
        this.props.onChange(value);
    },

    _setPercentValueState(percent, value, callback=null) {
        if (this.state.percent === percent) { return; }
        this._log(`_setPercentValueState => percent from: ${this.state.percent}, ${this.state.value} to: ${percent}, ${value}`);
        this.setState({percent: percent, value: value}, callback);
    },

    _setPercentValueStateAndEmitValueChangedEvent(percent, value) {
        this._setPercentValueState(percent, value, () => {
            this._emitValueChangeEvent(value);
        });
    }
});

export default Slider;
