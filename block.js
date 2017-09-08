const PIXI = require('pixi.js');
const { floor } = Math;

const SHEET_SIZE = 5;
const tileset = PIXI.BaseTexture.fromImage('images/tileset-new.png');

const Block = class {

	constructor(id, variation, rotation) {
		this.id = id;
		this.variation = variation || 0;
		this.rotation = rotation || 0;
	}

	generateTexture() {
		const position = STARTS[this.id] + this.variation;
		return new PIXI.Texture(tileset, new PIXI.Rectangle(16*(position % SHEET_SIZE), 16*floor(position / SHEET_SIZE), 16, 16));
	}

	generateSprite() {
		const sprite = new PIXI.Sprite(this.generateTexture());
		sprite.anchor.set(0.5, 0.5);
		sprite.rotation = Math.PI / 2 * this.rotation;
		return sprite;
	}

	redraw(sprite) {
		sprite.texture = this.generateTexture();
		sprite.rotation = Math.PI / 2 * this.rotation;
	}

	isGrass() {
		return this.id === Block.GRASS;
	}

	isDirt() {
		return this.id === Block.DIRT;
	}

};

Block.DIRT = 0;
Block.GRASS = 1;

const STARTS = {
	[Block.DIRT] : 0,
	[Block.GRASS] : 15
};

module.exports = Block;