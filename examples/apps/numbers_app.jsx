'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {InputNumber} from '../../src';

class NumbersApp extends React.Component {

	constructor() {
		super();
		this.state = {
			numberStringValue: '0'
		}
	}

	numberOnChange(value) {
		this.setState({numberStringValue: value});
	}

	render() {
		return (
			<div>
				<h3>InputNumbers</h3>
                <pre>{`
                `}
                </pre>
				<br />
				<InputNumber name="number_1" start={-1} onChange={this.numberOnChange.bind(this)} debug={false} />
				<InputNumber name="number_2" value={this.state.numberStringValue} start={-1} onChange={this.numberOnChange.bind(this)} debug={true} />
				<InputNumber name="number_3" defaultValue={'-1'} start={-1} onChange={this.numberOnChange.bind(this)} debug={false} />
				<InputNumber name="number_4" start={-1} end={2}  debug={false} />
				<InputNumber name="number_5" disabled={true} debug={false} />
			</div>
		);
	}
}

export default NumbersApp;
