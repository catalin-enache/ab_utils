'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {InputTextarea} from '../../src';

class InputTextareaApp extends React.Component {

	constructor() {
		super();
		let textValue = '';
		for (let i = 11; i <= 30; i++) {
			textValue += '^^' + i.toString().repeat(50)+'$$\n';
		}
		this.state = {
			textValue: textValue
		}
	}

	textOnChange(value) {
		this.setState({textValue: value});
	}

	render() {
		return (
			<div>
				<h3>InputTextarea</h3>
                <pre>{`
                `}
                </pre>
				<br />
				<div className="examples">

						<InputTextarea
							name="textarea_1"
							onChange={this.textOnChange.bind(this)}
							debug={false} />

						<InputTextarea
							name="textarea_2"
							value={this.state.textValue}
							onChange={this.textOnChange.bind(this)}
							debug={true} />

						{/* height will be constrained to min 50 */}
						<InputTextarea
							name="textarea_4"
							disabled={false}
							style={{width: '150px', height: '15px', sliderBackgroundColor: '#003366', sliderForegroundColor: 'indianred'}}
							debug={false} />

						<InputTextarea
							name="textarea_5"
							value={this.state.textValue}
							disabled={true}
							style={{width: '100%', height: '60px', fontSize: '30px', fontStyle: 'italic', fontWeight: 'bold'}}
							debug={false} />

				</div>

			</div>
		);
	}
}

export default InputTextareaApp;
