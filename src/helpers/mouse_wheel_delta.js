'use strict';
/*
* returns small multiples of +-1
* */
export default function getWheelDelta(wheelEvent) {
	let delta = wheelEvent.deltaY;
	let res = Math.abs(delta/100);
	return res < 1 ? -delta/3 : -delta/100; // res < 1 ? mozilla : chrome
}
