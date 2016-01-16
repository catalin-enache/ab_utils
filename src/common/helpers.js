'use strict';

/*
 * returns small multiples of +-1
 * */
export function getWheelDelta(wheelEvent) {
	let delta = wheelEvent.deltaY < 0 ? 1 : -1;
	let multiplier = wheelEvent.ctrlKey && wheelEvent.altKey ? 100 :
		wheelEvent.ctrlKey ? 5 :
			wheelEvent.altKey ? 10 : 1;
	return multiplier * delta;
}

export function trim(str, patternStart = /^\s+/, patternEnd = /\s+$/) {
	return str.replace(patternStart, '').replace(patternEnd, '');
}
