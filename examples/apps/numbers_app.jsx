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
				<div className="examples">
					<InputNumber name="number_1"
								 start={-1}
								 onChange={this.numberOnChange.bind(this)}
								 debug={false} />
					<br />
					<InputNumber name="number_2"
								 value={this.state.numberStringValue}
								 start={-1}
								 onChange={this.numberOnChange.bind(this)}
								 debug={true} />
					<br />
					<InputNumber name="number_3"
								 defaultValue={'-1'}
								 start={-1}
								 onChange={this.numberOnChange.bind(this)}
								 debug={false} />
					<br />
					<InputNumber name="number_4"
								 start={-100000000099}
								 end={100000000099}
								 debug={false} />
					<br />
					<InputNumber name="number_5"
								 disabled={true}
								 style={{width: '250px', height: '50px', fontSize: '30px', fontStyle: 'italic', fontWeight: 'bold'}}
								 debug={false} />
				</div>

			</div>
		);
	}
}

export default NumbersApp;
