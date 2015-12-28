'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {Slider, TextField} from '../src';

const Application = React.createClass({

    getInitialState() {
        return {
            sliderValue: 0.25
        };
    },

    sliderOnChange(value) {
        console.log(`handleOnChange: ${value}`);
        this.setState({sliderValue: value});
    },
    //<Slider.Horizontal value={this.state.value} start={-1} end={1} onChange={this.handleOnChange} size={'50%'} />

    render() {
        return (
            <div>
                <Slider.Horizontal value={this.state.sliderValue} start={-1} end={1} onChange={this.sliderOnChange} size={'50%'} />
                <br />
                <Slider.Horizontal value={this.state.sliderValue} start={-1} end={1} onChange={(value)=>{console.log(value)}} />
            </div>
        );
    }
});

ReactDOM.render(
    <Application />,
    document.getElementById('content')
);