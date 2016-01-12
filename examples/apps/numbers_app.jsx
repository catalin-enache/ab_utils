'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {Number} from '../../src';

class NumbersApp extends React.Component {

	constructor() {
		super();
		this.state = {
			numberValue: 0
		}
	}

	sliderOnChange(value) {
		this.setState({numberValue: value});
	}

	render() {
		return (
			<div>
				<h3>Numbers</h3>
                <pre>{`
<Number name="number_1" />
                `}
                </pre>
				<br />
				<Number name="number_1" />
			</div>
		);
	}
}

export default NumbersApp;
