'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {Slider} from '../../src';

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
<Slider
	name="slider_1"
	defaultValue={this.state.sliderValue}
	start={-2}
	end={4}
	onChange={this.sliderOnChange.bind(this)}
	style={{}}
	debug={false} />
<Slider
	name="slider_2"
	value={this.state.sliderValue}
	start={-2}
	end={4}
	onChange={this.sliderOnChange.bind(this)}
	style={{width: '100%', backgroundColor: '#003366', foregroundColor: 'darkred'}}
	debug={false} />
<Slider
	name="slider_3"
	defaultValue={this.state.sliderValue}
	start={-2}
	end={4}
	step={2}
	onChange={this.sliderOnChange.bind(this)}
	orientation="vertical"
	style={{height: '100%'}}
	debug={false} />
<Slider
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
				<div className="sliders clearfix">
					<div className="horizontalSliders">
						<div className="horizontalSliderWrapper">
							<Slider
								name="slider_1"
								defaultValue={this.state.sliderValue}
								start={-2}
								end={4}
								onChange={this.sliderOnChange.bind(this)}
								style={{}}
								debug={false} />
						</div>
						<div className="horizontalSliderWrapper">
							<Slider
								name="slider_2"
								value={this.state.sliderValue}
								start={-2}
								end={4}
								onChange={this.sliderOnChange.bind(this)}
								style={{width: '100%', backgroundColor: '#003366', foregroundColor: 'darkred'}}
								debug={false} />
						</div>
					</div>
					<div className="verticalSliders clearfix">
						<div className="verticalSliderWrapper">
							<Slider
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
							<Slider
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
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SlidersApp;
