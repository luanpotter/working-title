const PIXI = require('pixi.js');
const keyboard = require('./keyboard');

const MAX_W = MAX_H = 16*200;

const Player = class {

	constructor(stage) {
		this.sprite = new PIXI.Sprite.fromImage('./images/player.png');
		this.sprite.x = 100;
		this.sprite.y = 100;
		stage.addChild(this.sprite);

		keyboard('q').press = () => console.log(this.sprite.x, this.sprite.y);
	}

	update(position) {
		this.sprite.x += position.vx;
		this.sprite.y += position.vy;
	}

	camera() {
		const w = window.innerWidth/2;
		const h = window.innerHeight/2;
		return {
			x : Math.max(Math.min(-this.sprite.x + w, 0), -MAX_W + 2*w),
			y : Math.max(Math.min(-this.sprite.y + h, 0), -MAX_H + 2*h)
		};
	}
};

module.exports = Player;