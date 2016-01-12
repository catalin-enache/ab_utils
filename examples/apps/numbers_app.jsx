'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {InputNumber} from '../../src';

class NumbersApp extends React.Component {

	constructor() {
		super();
		this.state = {
			numberValue: 0
		}
	}

	numberOnChange(value) {
		this.setState({numberValue: value});
	}

	render() {
		return (
			<div>
				<h3>InputNumbers</h3>
                <pre>{`
                `}
                </pre>
				<br />
				<InputNumber name="number_1" onChange={this.numberOnChange.bind(this)} debug={true} />
				<InputNumber name="number_2" value={this.state.numberValue} onChange={this.numberOnChange.bind(this)} debug={true} />
				<InputNumber name="number_3" defaultValue={this.state.numberValue} onChange={this.numberOnChange.bind(this)} debug={false} />
				<InputNumber name="number_4" start={-1} end={1} defaultValue={0.1} debug={false} />
				<InputNumber name="number_5" disabled={true} />
			</div>
		);
	}
}

export default NumbersApp;
