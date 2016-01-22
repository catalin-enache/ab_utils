'use strict';

import React from 'react';

export default function DoubleRendering (Component) {
	class Decorated extends Component {

		constructor(props) {
			super(props);
			this._needsDoubleRendering = false;
			if (this.mounted === undefined) {
				throw new Error(`DoubleRendering deco depends on GenericDeco. Check ${Component.displayName} decorators.`);
			}
			if (this._afterRender === undefined) {
				throw new Error(`_afterRender is not defined in ${Component.displayName}`);
			}
		}

		componentWillReceiveProps(...args) {
			// a style diff is not enough
			// as out of reach wrappers may change their width/height
			// and our component style width/height: 100% will not change
			// so we are forced to hardcode true
			this._needsDoubleRendering = true;
			super.componentWillReceiveProps && super.componentWillReceiveProps(...args);
		}

		componentDidUpdate() {
			if (!this.mounted) return;
			if (this._needsDoubleRendering) {
				this._log(`on componentDidUpdate calling _afterRender`);
				this._needsDoubleRendering = false;
				this._afterRender();
			}
			super.componentDidUpdate && super.componentDidUpdate();
		}
	}
	return Decorated;
}

