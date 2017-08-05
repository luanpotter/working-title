const PIXI = require('pixi.js');

const empty = len => new Array(len).fill(0);
const range = len => empty(len).map((_, i) => i);

const level = empty(200).map(_ => empty(200).map(_ => 10));

const randomGrass = [ 3, 4, 5, 9, 11, 15, 16, 17 ];
range(200*200 / 10).forEach(() => {
	const x = Math.floor(Math.random() * level.length);
	const y = Math.floor(Math.random() * level[0].length);
	const id = Math.floor(Math.random() * randomGrass.length);
	level[x][y] = randomGrass[id];
});

const Map = class {

	constructor(stage) {
		var tileset  = PIXI.BaseTexture.fromImage('images/tileset.png');
		for (let i = 0; i < level.length; i++) {
			for (let j = 0; j < level[i].length; j++) {
				const id = level[i][j];
				const texture = new PIXI.Texture(tileset, new PIXI.Rectangle(16*(id % 6), 16*Math.floor(id / 6), 16, 16));
				const sprite = new PIXI.Sprite(texture);
				sprite.x = i*16;
				sprite.y = j*16;
				stage.addChild(sprite);
			}
		}
	}

	tick() {
	}
};

module.exports = Map;