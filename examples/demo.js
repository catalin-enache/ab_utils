'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {Slider, TextField} from '../src';

const Application = React.createClass({

    getInitialState() {
        return {
            sliderValue: 0.50
        };
    },

    sliderOnChange(value) {
        console.log(`Application handleOnChange: ${value}`);
        this.setState({sliderValue: value});
    },
    //<Slider.Horizontal name="slider_2" defaultValue={-1} start={-2} end={2} onChange={this.sliderOnChange} />

    render() {
        return (
            <div>
                <Slider.Horizontal name="slider_1" defaultValue={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange}  />
                <br />
                <Slider.Horizontal name="slider_2" value={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange} debug={true} />

            </div>
        );
    }
});

ReactDOM.render(
    <Application />,
    document.getElementById('content')
);