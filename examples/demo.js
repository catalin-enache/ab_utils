'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {Slider, TextField} from '../src';

const Application = React.createClass({

    getInitialState() {
        return {
            sliderValue: 0
        };
    },

    sliderOnChange(value) {
        console.log(`Application handleOnChange: ${value}`);
        this.setState({sliderValue: value});
    },



    render() {
        return (
            <div>
                <h3>Sliders</h3>
                <div className="sliders clearfix">
                    <div className="horizontalSliders">
                        <div className="horizontalSliderWrapper">
                            <Slider name="slider_1" defaultValue={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange}  />
                        </div>
                        <div className="horizontalSliderWrapper">
                            <Slider name="slider_2" value={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange} style={{width: '75%', bgColor: '#003366'}} />
                        </div>
                    </div>
                    <div className="verticalSliders clearfix">
                        <div className="verticalSliderWrapper">
                            <Slider name="slider_3"  defaultValue={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange} orientation="vertical" style={{height: '100%'}} />
                        </div>
                        <div className="verticalSliderWrapper">
                            <Slider name="slider_4"  value={this.state.sliderValue} start={-2} end={2} disabled={true} onChange={this.sliderOnChange} orientation="vertical" style={{height: '75%', bgColor: '#003366', width: '8px', border: '1px solid black', boxSizing: 'border-box'}} debug={true}  />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
});

ReactDOM.render(
    <Application />,
    document.getElementById('content')
);