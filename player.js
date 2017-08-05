const PIXI = require('pixi.js');
const keyboard = require('./keyboard');

const MAX_W = MAX_H = 16*200;

const Player = class {

	constructor(stage) {
		this.sprite = new PIXI.Sprite.fromImage('./images/player.png');
		this.sprite.x = 100;
		this.sprite.y = 100;
		stage.addChild(this.sprite);

		this.block = 10;
		keyboard('1').press = () => this.block = 10;
		keyboard('2').press = () => this.block = 7;

		this.selector = new PIXI.Graphics();
		this.selector.lineStyle(1, 0xFF0000);
		this.selector.drawRect(0, 0, 16, 16);
		stage.addChild(this.selector);
	}

	update(position) {
		this.sprite.x += position.vx;
		this.sprite.y += position.vy;

		this.selector.x = 16 * Math.floor(this.sprite.x / 16);
		this.selector.y = 16 * Math.floor(this.sprite.y / 16);
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