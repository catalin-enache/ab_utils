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
<InputNumber name="number_1"
	 start={-1}
	 onChange={this.numberOnChange.bind(this)}
	 debug={false} />
<InputNumber name="number_2"
	 value={this.state.numberStringValue}
	 start={-1}
	 onChange={this.numberOnChange.bind(this)}
	 debug={false} />
<InputNumber name="number_3"
	 defaultValue={'-1'}
	 start={-1}
	 onChange={this.numberOnChange.bind(this)}
	 debug={false} />
{/* height will be constrained to min 20 */}
<InputNumber name="number_4"
	 start={-100000000099}
	 end={100000000099}
	 step={1}
	 disabled={false}
	 style={{width: '150px', height: '15px'}}
	 debug={true} />
{/* height will be constrained to max 50 */}
<InputNumber name="number_5"
	 disabled={true}
	 style={{width: '250px', height: '60px', fontSize: '30px', fontStyle: 'italic', fontWeight: 'bold'}}
	 debug={false} />
                `}
                </pre>
				<br />
				<div className="examples">
					<div>
						<InputNumber name="number_1"
									 start={-1}
									 onChange={this.numberOnChange.bind(this)}
									 debug={false} />
					</div>
					<div>
						<InputNumber name="number_2"
									 value={this.state.numberStringValue}
									 start={-1}
									 onChange={this.numberOnChange.bind(this)}
									 debug={false} />
					</div>
					<div>
						<InputNumber name="number_3"
									 defaultValue={'-1'}
									 start={-1}
									 onChange={this.numberOnChange.bind(this)}
									 debug={false} />
					</div>
					<div>
						{/* height will be constrained to min 20 */}
						<InputNumber name="number_4"
									 start={-100000000099}
									 end={100000000099}
									 step={1}
									 disabled={false}
									 style={{width: '150px', height: '15px'}}
									 debug={true} />
					</div>
					<div>
						{/* height will be constrained to max 50 */}
						<InputNumber name="number_5"
									 disabled={true}
									 style={{width: '250px', height: '60px', fontSize: '30px', fontStyle: 'italic', fontWeight: 'bold'}}
									 debug={false} />
					</div>
				</div>

			</div>
		);
	}
}

export default NumbersApp;
