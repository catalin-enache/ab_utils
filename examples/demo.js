'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {Slider, TextField} from '../src';

const Application = React.createClass({

    getInitialState() {
        return {
            value: -25
        };
    },

    handleOnChange(value) {
        this.setState({value: value});
    },

    render() {
        return (
            <div>
                <Slider.Horizontal value={this.state.value} start={-100} end={0} onChange={this.handleOnChange} />
                <br />
                <Slider.Horizontal value={this.state.value} start={-100} end={0} onChange={(value) => console.log('---')} />
            </div>
        );
    }
});

ReactDOM.render(
    <Application />,
    document.getElementById('content')
);