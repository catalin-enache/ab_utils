'use strict';

import React from 'react';

export default function GenericDeco (Component) {
	class Decorated extends Component {
		componentDidMount() {
			this.mounted = true;
			super.componentDidMount();
		}

		componentWillUnmount() {
			this.mounted = false;
			super.componentWillUnmount();
		}
	}
	return Decorated;
}

