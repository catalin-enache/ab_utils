'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {InputSlider} from '../../src';

class SlidersApp extends React.Component {

	constructor() {
		super();
		this.state = {
			sliderValue: 0,
			disabled: false
		}

		setTimeout(() => {
			console.log('now disabling')
			this.setState({disabled: true});
		}, 1000)
	}

	sliderOnChange(value) {
		this.setState({sliderValue: value});
	}

	render() {
		return (
			<div>
				<h3>Sliders</h3>
                <pre>{`
<InputSlider
	name="slider_1"
	defaultValue={this.state.sliderValue}
	start={-2}
	end={4}
	onChange={this.sliderOnChange.bind(this)}
	style={{}}
	debug={false} />
<InputSlider
	name="slider_2"
	value={this.state.sliderValue}
	start={-2}
	end={4}
	onChange={this.sliderOnChange.bind(this)}
	style={{width: '100%', backgroundColor: '#003366', foregroundColor: 'darkred'}}
	debug={false} />
<InputSlider
	name="slider_3"
	defaultValue={this.state.sliderValue}
	start={-2}
	end={4}
	step={2}
	onChange={this.sliderOnChange.bind(this)}
	orientation="vertical"
	style={{height: '100%'}}
	debug={false} />
<InputSlider
	name="slider_4"
	value={this.state.sliderValue}
	start={-2}
	end={4}
	step={1}
	disabled={this.state.disabled}
	onChange={this.sliderOnChange.bind(this)}
	orientation="vertical"
	style={{height: '75%', backgroundColor: '#003366', width: '8px', border: '1px solid black', boxSizing: 'border-box'}}
	debug={false}
	className="slider-custom" />
                    `}
                </pre>
				<p>value: {this.state.sliderValue}</p>
				<br />
				<div className="sliders examples ab-clearfix">
					<div className="horizontalSliders">
						<div className="horizontalSliderWrapper">
							<InputSlider
								name="slider_1"
								defaultValue={this.state.sliderValue}
								start={-2}
								end={4}
								onChange={this.sliderOnChange.bind(this)}
								style={{}}
								debug={false} />
						</div>
						<div className="horizontalSliderWrapper">
							<InputSlider
								name="slider_2"
								value={this.state.sliderValue}
								start={-2}
								end={4}
								onChange={this.sliderOnChange.bind(this)}
								style={{width: '100%', backgroundColor: 'rgb(0, 51, 102)', foregroundColor: 'darkorange'}}
								debug={false} />
						</div>
					</div>
					<div className="verticalSliders ab-clearfix">
						<div className="verticalSliderWrapper">
							<InputSlider
								name="slider_3"
								defaultValue={this.state.sliderValue}
								start={-2}
								end={4}
								step={2}
								onChange={this.sliderOnChange.bind(this)}
								orientation="vertical"
								style={{height: '100%'}}
								debug={false} />
						</div>
						<div className="verticalSliderWrapper">
							<InputSlider
								name="slider_4"
								value={this.state.sliderValue}
								start={-2}
								end={4}
								step={1}
								disabled={this.state.disabled}
								onChange={this.sliderOnChange.bind(this)}
								orientation="vertical"
								style={{height: '75%', backgroundColor: '#003366', width: '5px', border: '1px solid black', boxSizing: 'border-box'}}
								debug={false}
								className="slider-custom" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SlidersApp;
