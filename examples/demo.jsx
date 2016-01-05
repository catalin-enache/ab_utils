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
		this.setState({sliderValue: value});
	},

	render() {
		return (
			<div>
				<h3>Info</h3>
                <pre>{`
Controlled components (those having 'value') update themselves through their parent via componentWillReceiveProps.
Flow: component emits onChange
    -> parent updates and pass new prop value
    -> componentWillReceiveProps
    -> component setState

Uncontrolled components (those having 'defaultValue') update themselves by their own, then emit onChange.
Flow: component setState
    -> component emit onChange
    -> parent receives event
    -> component ignores eventual defaultValue changes in componentWillReceiveProps
                `}</pre>
				<h3>Sliders</h3>
                <pre>
                    {`
<Slider name="slider_1"
	defaultValue={this.state.sliderValue}
	start={-2}
	end={2}
	onChange={this.sliderOnChange}
		style={{}} />
<Slider name="slider_2"
	value={this.state.sliderValue}
	start={-2}
	end={2}
	onChange={this.sliderOnChange}
	style={{width: '100%', bgColor: '#003366'}}
	debug={false} />
<Slider name="slider_3"
	defaultValue={this.state.sliderValue}
	start={-2}
	end={2}
	step={1}
	onChange={this.sliderOnChange}
	orientation="vertical"
	style={{height: '100%'}} />
<Slider name="slider_4"
	value={this.state.sliderValue}
	start={-2}
	end={2}
	step={1}
	disabled={true}
	onChange={this.sliderOnChange}
	orientation="vertical"
	style={{height: '75%', bgColor: '#003366', width: '8px', border: '1px solid black', boxSizing: 'border-box'}}
	debug={false} />
                    `}
                </pre>
				<p>value: {this.state.sliderValue}</p>
				<div className="sliders clearfix">
					<div className="horizontalSliders">
						<div className="horizontalSliderWrapper">
							<Slider name="slider_1"
									defaultValue={this.state.sliderValue}
									start={-2}
									end={2}
									onChange={this.sliderOnChange}
									style={{}} />
						</div>
						<div className="horizontalSliderWrapper">
							<Slider name="slider_2"
									value={this.state.sliderValue}
									start={-2}
									end={2}
									onChange={this.sliderOnChange}
									style={{width: '100%', bgColor: '#003366'}}
									debug={true} />
						</div>
					</div>
					<div className="verticalSliders clearfix">
						<div className="verticalSliderWrapper">
							<Slider name="slider_3"
									defaultValue={this.state.sliderValue}
									start={-2}
									end={2}
									step={1}
									onChange={this.sliderOnChange}
									orientation="vertical"
									style={{height: '100%'}} />
						</div>
						<div className="verticalSliderWrapper">
							<Slider name="slider_4"
									value={this.state.sliderValue}
									start={-2}
									end={2}
									step={1}
									disabled={true}
									onChange={this.sliderOnChange}
									orientation="vertical"
									style={{height: '75%', bgColor: '#003366', width: '8px', border: '1px solid black', boxSizing: 'border-box'}}
									debug={false} />
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
