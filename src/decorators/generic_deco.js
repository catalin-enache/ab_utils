'use strict';

import React from 'react';

export default function GenericDeco (Component) {
	class Decorated extends Component {
		constructor(props) {
			super(props);
			this.mounted = false;
		}

		componentDidMount() {
			this.mounted = true;
			super.componentDidMount && super.componentDidMount();
		}

		componentWillUnmount() {
			this.mounted = false;
			super.componentWillUnmount && super.componentWillUnmount();
		}
	}
	return Decorated;
}

