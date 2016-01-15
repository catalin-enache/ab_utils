'use strict';

/*
 * returns small multiples of +-1
 * */
export function getWheelDelta(wheelEvent) {
	let delta = wheelEvent.deltaY;
	let res = Math.abs(delta/100);
	let multiplier = wheelEvent.ctrlKey && wheelEvent.altKey ? 100 : wheelEvent.ctrlKey ? 5 : wheelEvent.altKey ? 10 : 1;
	return multiplier * (res < 1 ? -delta/3 : -delta/100); // res < 1 ? mozilla : chrome
}

export function trim(str, patternStart = /^\s+/, patternEnd = /\s+$/) {
	return str.replace(patternStart, '').replace(patternEnd, '');
}
