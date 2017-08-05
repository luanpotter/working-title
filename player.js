const PIXI = require('pixi.js');
const keyboard = require('./keyboard');

const Player = class {

	constructor(stage) {
		this.sprite = new PIXI.Sprite.fromImage('./images/player.png');
		this.sprite.x = window.innerWidth / 2;
		this.sprite.y = window.innerHeight / 2;
		stage.addChild(this.sprite);

		this.vx = this.vy = 0;

		const keys = {
			w : keyboard('w'),
			a : keyboard('a'),
			s : keyboard('s'),
			d : keyboard('d')
		};

		const SPEED = 5;

		keys.w.press = () => { this.vy = -SPEED; this.vx = 0; }
		keys.a.press = () => { this.vx = -SPEED; this.vy = 0; }
		keys.s.press = () => { this.vy = +SPEED; this.vx = 0; }
		keys.d.press = () => { this.vx = +SPEED; this.vy = 0; }

		keys.w.release = () => this.vy = keys.s.isDown ? +SPEED : 0;
		keys.a.release = () => this.vx = keys.d.isDown ? +SPEED : 0;;
		keys.s.release = () => this.vy = keys.w.isDown ? -SPEED : 0;;
		keys.d.release = () => this.vx = keys.a.isDown ? -SPEED : 0;;
	}

	tick() {
		this.sprite.x += this.vx;
		this.sprite.y += this.vy;
	}
};

module.exports = Player;