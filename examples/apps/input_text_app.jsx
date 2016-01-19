'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {InputText} from '../../src';

class InputTextApp extends React.Component {

	constructor() {
		super();
		this.state = {
			textValue: 'abc'
		}
	}

	textOnChange(value) {
		this.setState({textValue: value});
	}

	render() {
		return (
			<div>
				<h3>InputTexts</h3>
                <pre>{`
                `}
                </pre>
				<br />
				<div className="examples">
					<div>
						<InputText
							name="text_1"
							onChange={this.textOnChange.bind(this)}
							debug={false} />
					</div>
					<div>
						<InputText
							name="text_2"
							value={this.state.textValue}
							onChange={this.textOnChange.bind(this)}
							debug={false} />
					</div>
					<div>
						<InputText
							name="text_3"
							defaultValue={'def'}
							start={-1}
							onChange={this.textOnChange.bind(this)}
							debug={false} />
					</div>
					<div>
						{/* height will be constrained to min 20 */}
						<InputText
							name="text_4"
							disabled={false}
							style={{width: '150px', height: '15px'}}
							debug={false} />
					</div>
					<div>
						{/* height will be constrained to max 50 */}
						<InputText
							name="number_5"
							value={this.state.textValue}
							disabled={true}
							style={{width: '250px', height: '60px', fontSize: '30px', fontStyle: 'italic', fontWeight: 'bold'}}
							debug={false} />
					</div>
				</div>

			</div>
		);
	}
}

export default InputTextApp;
