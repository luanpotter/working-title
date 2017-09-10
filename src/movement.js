const keyboard = require('./keyboard');

const setup = () => {

	const p = {
		vx: 0,
		vy: 0
	};

	const keys = {
		w : keyboard('w'),
		a : keyboard('a'),
		s : keyboard('s'),
		d : keyboard('d')
	};

	const SPEED = 5;

	keys.w.press = () => p.vy = -SPEED;
	keys.a.press = () => p.vx = -SPEED;
	keys.s.press = () => p.vy = +SPEED;
	keys.d.press = () => p.vx = +SPEED;

	keys.w.release = () => p.vy = keys.s.isDown ? +SPEED : 0;
	keys.a.release = () => p.vx = keys.d.isDown ? +SPEED : 0;
	keys.s.release = () => p.vy = keys.w.isDown ? -SPEED : 0;
	keys.d.release = () => p.vx = keys.a.isDown ? -SPEED : 0;

	return p;
};

module.exports = setup;