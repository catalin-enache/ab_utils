'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import SlidersApp from './apps/sliders_app';

class Application extends React.Component {

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

				<SlidersApp />

				</div>
		);
	}
};

ReactDOM.render(
	<Application />,
	document.querySelector('#content')
);
