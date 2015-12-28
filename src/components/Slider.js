'use strict';

import React from 'react';
import Style from '../style';

const Horizontal = React.createClass({
    propTypes: {
        value: React.PropTypes.number.isRequired,
        start: React.PropTypes.number.isRequired,
        end: React.PropTypes.number.isRequired,
        onChange: React.PropTypes.func.isRequired,

        size:	React.PropTypes.string,
        step: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            size: '100%',
            step: null
        };
    },

    //getInitialState() {
    //    return {
    //        percent: 0
    //    };
    //},

    componentDidMount() {
        console.log(`componentDidMount`);
        this._updateVars();
        //this.setState({percent: this._valueToPercent(this.props.value)});
        this.forceUpdate();
    },

    //componentWillReceiveProps(nextProps) {
    //    console.log(`componentWillReceiveProps`);
    //    this.setState({percent: this._valueToPercent(nextProps.value)});
    //},

    handleOnClick(e) {
        this._updateVars();

        let percent = this._eventToPercent(e);
        let newValue = this._percentToValue(percent);

        //this.setState({percent: percent});

        this.props.onChange(newValue);
    },

    render() {
        console.log(`render: ${this.props.value}`);

        //let innerWidth = this._outerWidth * this.state.percent;
        let innerWidth = this._outerWidth * this._valueToPercent(this.props.value);

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

    _updateVars() {
        let boundingClientRect = this.refs.outer.getBoundingClientRect();

        this._offsetLeft = parseInt(boundingClientRect.left);
        this._outerWidth = parseInt(boundingClientRect.width);
    },

    _eventToPercent(e) {
        let positionX = e.pageX - this._offsetLeft;
        return positionX/this._outerWidth;
    },

    _valueToPercent(value) {
        let range = this.props.end - this.props.start;
        let position = value - this.props.start;
        return position/range;
    },

    _percentToValue(percent) {
        let range = this.props.end - this.props.start;
        return range * percent + this.props.start;
    }
});

export default {
    Horizontal
};