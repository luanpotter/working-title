const PIXI = require('pixi.js');

const Player = class {

	constructor(stage) {
		this.sprite = new PIXI.Sprite.fromImage('./images/player.png');
		this.sprite.x = window.innerWidth / 2;
		this.sprite.y = window.innerHeight / 2;
		stage.addChild(this.sprite);
	}
};

module.exports = Player;