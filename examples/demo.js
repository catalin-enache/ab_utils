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
                            <Slider name="slider_1" defaultValue={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange} />
                        </div>
                        <div className="horizontalSliderWrapper">
                            <Slider name="slider_2" value={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange} />
                        </div>
                    </div>
                    <div className="verticalSliders clearfix">
                        <div className="verticalSliderWrapper">
                            <Slider name="slider_3"  defaultValue={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange} orientation="vertical" />
                        </div>
                        <div className="verticalSliderWrapper">
                            <Slider name="slider_4" cStyle={{size: '75%'}}  value={this.state.sliderValue} start={-2} end={2} onChange={this.sliderOnChange} orientation="vertical" />
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