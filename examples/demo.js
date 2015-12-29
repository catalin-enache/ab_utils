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
            <div style={{border: '1px solid black'}}>
                <Slider name="slider_1" defaultValue={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange} debug={true} />
                <br />
                <div style={{ height: '200px', backgroundColor: 'bisque', paddingTop: '10px', paddingBottom: '10px'}}>
                    <Slider name="slider_2" cStyle={{thickness: '30px', size: '50%'}}  value={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange} debug={true} orientation="vertical" />
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Application />,
    document.getElementById('content')
);