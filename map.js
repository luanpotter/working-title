const PIXI = require('pixi.js');
const Block = require('./block.js');

const { rand, empty, range, arrEq, inside } = require('./util.js');
const { cos, sin, PI, floor } = Math;

const level = empty(200).map(_ => empty(200).map(_ => new Block(Block.GRASS)));

const set = (arr, x, y, v) => {
	if (x < 0 || y < 0) {
		return;
	}
	if (x >= arr.length || y >= arr[x].length) {
		return;
	}
	arr[x][y] = v;
};

const get = (arr, x, y) => {
	if (x < 0 || y < 0) {
		return;
	}
	if (x >= arr.length || y >= arr[x].length) {
		return;
	}
	return arr[x][y];
};

// randomize grass

const grassVariations = [ 1, 2, 5, 6, 7 ];
range(200*200 / 10).forEach(() => {
	const x = rand(level.length);
	const y = rand(level[0].length);
	level[x][y].variation = grassVariations[rand(grassVariations.length)];
});

if (false)
range(5 + rand(5)).forEach(() => {
	const cx = rand(level.length);
	const cy = rand(level[0].length);
	const sides = 4 + rand(4);
	const radius = 8 + rand(4);
	const poly = range(sides).map((_, i) => {
		const angle = i * 2 * PI / sides;
		const dx = radius * cos(angle) + rand() * 4 - 2, dy = radius * sin(angle) + rand() * 4 - 2;
		return [cx + dx, cy + dy];
	});
	range(32).forEach(i => {
		range(32).forEach(j => {
			const x = cx - 16 + i;
			const y = cy - 16 + j;
			if (inside([x, y], poly)) {
				set(level, x, y, new Block(Block.DIRT));
			}
		});
	});
});

range(4).forEach(i => range(10).forEach(j => level[10 + i][10 + j] = new Block(Block.DIRT)));
level[9][10 + 4] = new Block(Block.DIRT);
level[10 + 2][9] = new Block(Block.DIRT);
level[10 + 2][20] = new Block(Block.DIRT);
level[14][10 + 4] = new Block(Block.DIRT);

const getBorders = (i, j) => {
	const GET = [ [+1, 0], [+1, -1], [0, -1], [-1, -1], [-1, 0], [-1, +1], [0, +1], [+1, +1] ];
	const getIdx = idx => get(level, i + GET[idx][0], j + GET[idx][1]);
	return range(8).filter(idx => getIdx(idx).isDirt());
};

const getDirtMetadata = (i, j) => {
	const borders = getBorders(i, j);
	const cross = borders.filter(i => i % 2 === 0);
	if (cross.length === 0) {
		return [ 0, 0 ];
	}
	if (cross.length === 1) {
		const map = { 0:3, 2:2, 4:1, 6:0 };
		return [ 1, map[cross[0]] ];
	}
	if (cross.length === 3) {
		const map = { 0:2, 2:1, 4:0, 6:3 };
		return [ 5, map[[0, 2, 4, 6].find(el => !cross.includes(el))] ];
	}
	return [ 8, 0 ];
};

const fixDirts = () => {
	level.forEach((line, i) => line.forEach((cell, j) => {
		if (cell.isDirt()) {
			const [ variation, rotation ] = getDirtMetadata(i, j);
			level[i][j].variation = variation;
			level[i][j].rotation = rotation;
		}
	}));
};
fixDirts();

const Map = class {

	constructor(stage) {
		this.sprites = [];
		this.spriteMap = {};
		for (let i = 0; i < level.length; i++) {
			for (let j = 0; j < level[i].length; j++) {
				const sprite = level[i][j].generateSprite();
				sprite.x = i*16 + 8;
				sprite.y = j*16 + 8;
				stage.addChild(sprite);
				this.spriteMap[i + ':' + j] = sprite;
				this.sprites.push(sprite);
			}
		}
	}

	redraw(i, j) {
		level[i][j].redraw(this.spriteMap[i + ':' + j]);
	}

	find(entity) {
		return [floor(entity.sprite.x / 16), floor(entity.sprite.y / 16)];
	}

	say(pos) {
		const [i, j] = pos;
		console.log(i, j);
		console.log(i, j, level[i][j]);
	}

	set(pos, block) {
		const [i, j] = pos;
		level[i][j] = new Block(block);
		fixDirts();
		for (let di = i - 1; di <= i + 1; di++) {
			for (let dj = j - 1; dj <= j + 1; dj++) {
				this.redraw(di, dj);
			}
		}
	}
};

module.exports = Map;