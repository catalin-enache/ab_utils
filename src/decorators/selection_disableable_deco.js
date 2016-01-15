'use strict';

import React from 'react';

export default function SelectionDisableableDeco (Component) {
	class Decorated extends Component {

		constructor(props) {
			super(props);

			this._disableSelection = this._disableSelection.bind(this);
			this._killSelection = this._killSelection.bind(this);
			this._enableSelection = this._enableSelection.bind(this);
		}

		_disableSelection() {
			// first clear any current selection
			window.getSelection && window.getSelection().removeAllRanges();

			// then disable further selection

			// 1. by style
			document.body.style.MozUserSelect = "none";
			document.body.style.WebkitUserSelect = "none";
			document.body.style.userSelect = "none";

			// 2. by adding event listeners: selectstart || mousemove
			let evt = document.onselectstart !== undefined ? 'selectstart' : 'mousemove';
			document.addEventListener(evt, this._killSelection, false);
			document.addEventListener('mouseup', this._enableSelection, false);
		}

		_killSelection(e) {
			switch(e.type) {
				case 'selectstart':
					e.preventDefault();
					break;
				case 'mousemove':
					window.getSelection && window.getSelection().removeAllRanges();
					break;
			}
		}

		_enableSelection() {
			// 1. by style
			document.body.style.MozUserSelect = null;
			document.body.style.WebkitUserSelect = null;
			document.body.style.userSelect = null;

			// 2. by removing event listeners: selectstart || mousemove
			let evt = document.onselectstart !== undefined ? 'selectstart' : 'mousemove';
			document.removeEventListener(evt, this._killSelection, false);
			document.removeEventListener('mouseup', this._enableSelection, false);
		}

	}

	return Decorated;
}

