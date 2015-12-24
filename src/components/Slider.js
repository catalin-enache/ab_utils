'use strict';

import React from 'react';
import Style from '../style';

const Horizontal = React.createClass({
    propTypes: {
        value: React.PropTypes.number.isRequired,
        start: React.PropTypes.number.isRequired,
        end: React.PropTypes.number.isRequired,
        onChange: React.PropTypes.func.isRequired,

        width:	React.PropTypes.string,

        step: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            width: '100%',
            step: null
        };
    },

    getInitialState() {
        return {
            offsetLeft: 0,
            outerWidth: 0,
            innerWidth: 0
        };
    },

    componentDidMount() {
        let boundingClientRect = this.refs.outer.getBoundingClientRect();

        let offsetLeft = parseInt(boundingClientRect.left);
        let outerWidth = parseInt(boundingClientRect.width);

        let range = this.props.end - this.props.start;
        let position = this.props.value - this.props.start;
        let percent = position/range;
        let innerWidth = outerWidth * percent;

        this.setState({offsetLeft: offsetLeft, innerWidth: innerWidth, outerWidth: outerWidth});
    },

    componentWillReceiveProps(nextProps, nextContext) {
        console.log(`Slider ${this.props.value}`);

        let range = this.props.end - this.props.start;
        let position = nextProps.value - this.props.start;
        let percent = position/range;
        let innerWidth = this.state.outerWidth * percent;

        this.setState({innerWidth: innerWidth});
    },

    handleOnClick(e) {
        let positionX = e.pageX - this.state.offsetLeft;

        let percent = positionX/this.state.outerWidth;
        let innerWidth = this.state.outerWidth * percent;

        let newValue = (this.props.end - this.props.start) * percent + this.props.start;

        this.props.onChange(newValue);

        //this.setState({innerWidth: innerWidth});
    },

    render() {

        let backgroundStyle = Object.assign({}, Style.horizontalSlider.background, {
            width: this.props.width
        });

        let foregroundStyle = Object.assign({}, Style.horizontalSlider.foreground, {
            width: `${this.state.innerWidth}px`
        });

        return (
            <div>
                <div ref="outer" style={backgroundStyle} onClick={this.handleOnClick}>
                    <div style={foregroundStyle}></div>
                </div>
            </div>
        );
    }
});

export default {
    Horizontal
};