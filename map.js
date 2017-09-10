const PIXI = require('pixi.js');
const Block = require('./block.js');

const { rand, empty, range, arrEq, inside } = require('./util.js');
const { cos, sin, PI, floor, abs } = Math;

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
		return Block.NULL;
	}
	if (x >= arr.length || y >= arr[x].length) {
		return Block.NULL;
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

const GET = [ [+1, 0], [+1, -1], [0, -1], [-1, -1], [-1, 0], [-1, +1], [0, +1], [+1, +1] ];
const getIdx = (i, j, desloc) => get(level, i + desloc[0], j + desloc[1]);
const getBorders = (i, j) => range(8).filter(idx => getIdx(i, j, GET[idx]).isDirt());
const getDirtMetadata = (i, j) => {
	const borders = getBorders(i, j);
	const cross = borders.filter(i => i % 2 === 0);
	const corners = borders.filter(i => i % 2 === 1);
	if (cross.length === 0) {
		return [ 0, 0 ];
	}
	if (cross.length === 1) {
		const map = { 0:3, 2:2, 4:1, 6:0 };
		return [ 1, map[cross[0]] ];
	}
	if (cross.length === 3) {
		const oddOneOut = [0, 2, 4, 6].find(el => !cross.includes(el));
		const actualCorners = corners.filter(c => abs(c - oddOneOut) > 1 && abs(c - oddOneOut) < 7);
		if (actualCorners.length === 0) {
			const map = { 0:3, 2:2, 4:1, 6:0 };
			return [ 7, map[oddOneOut]];
		} else if (actualCorners.length === 1) {
			const map = { 0:3, 2:2, 4:1, 6:0 };
			const myCorner = actualCorners[0];
			let shouldFlip = GET[oddOneOut][0] == 0 ? GET[myCorner][0] : -GET[myCorner][1];
			if (oddOneOut === 6 || oddOneOut === 0) {
				shouldFlip *= -1;
			}
			const flip = shouldFlip === -1 ? 6 : 14;
			if (oddOneOut === 0) {
				return [ flip, 3 ];
			} else if (oddOneOut === 2) {
				return [ flip, 2 ];
			} else if (oddOneOut === 4) {
				return [ flip, 1 ];
			} else if (oddOneOut === 6) {
				return [ flip, 0 ];
			}
		} else {
			const map = { 0:2, 2:1, 4:0, 6:3 };
			return [ 5, map[oddOneOut] ];
		}
	}
	if (cross.length === 2) {
		const id = cross.sort().join('+');
		if (id === '0+4') {
			return [ 2, 0 ];
		}
		if (id === '2+6') {
			return [ 2, 1 ];
		}
		const desloc = GET[cross[0]].map((el, i) => el + GET[cross[1]][i]);
		const centralDirt = getIdx(i, j, desloc).isDirt();
		const map = { '0+2': 1, '0+6': 2, '2+4': 0, '4+6': 3 };
		return [ centralDirt ? 4 : 3, map[id] ];
	}
	// 4
	if (corners.length === 3) {
		const map = { 1:1, 3:0, 5:3, 7:2 };
		return [ 9, map[[1, 3, 5, 7].find(el => !corners.includes(el))] ];
	}
	if (corners.length === 2) {
		const id = corners.sort().join('+');
		return {
			'1+3': [13, 3],
			'1+5': [12, 1],
			'1+7': [13, 0],
			'3+5': [13, 2],
			'3+7': [12, 1],
			'5+7': [13, 1]
		}[id];
	}
	if (corners.length === 1) {
		const actualCorner = corners[0];
		const map = { 1:0, 3:3, 5:2, 7:1 };
		return [ 11, map[actualCorner] ];
	}
	if (corners.length === 0) {
		return [ 10, 0 ];
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
