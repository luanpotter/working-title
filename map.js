const PIXI = require('pixi.js');
const { rand, empty, range, arrEq, inside } = require('./util.js');
const { cos, sin, PI, floor } = Math;

const level = empty(200).map(_ => empty(200).map(_ => 10));

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

const randomGrass = [ 3, 4, 5, 9, 11, 15, 16, 17 ];
const isGrass = tile => !tile || tile === 10 || randomGrass.includes(tile);
range(200*200 / 10).forEach(() => {
	const x = rand(level.length);
	const y = rand(level[0].length);
	const id = rand(randomGrass.length);
	level[x][y] = randomGrass[id];
});

// generate dirt
const dirt = 7;

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
				set(level, x, y, dirt);
			}
		});
	});
});

range(4).forEach(i => range(10).forEach(j => level[10 + i][10 + j] = 7));
level[9][10 + 4] = level[10 + 2][9] = level[10 + 2][20] = level[14][10 + 4] = 7;

// fix dirt borders

const dirts = {
	0: [[2, 3, 4, 5, 6], [3, 4, 5, 6], [2, 3, 4, 5], [3, 4, 5]],
	1: [[2, 3, 4], [3, 4], [2, 3]],
	2: [[1, 2, 3, 4, 8], [1, 2, 3, 8], [1, 2, 3, 4], [1, 2, 3]],
	6: [[4, 5, 6], [5, 6], [4, 5]],
	7: [[]],
	8: [[1, 2, 8], [1, 8], [1, 2]],
	12: [[4, 5, 6, 7, 8], [5, 6, 7, 8], [4, 5, 6, 7], [5, 6, 7]],
	13: [[6, 7, 8], [7, 8], [6, 7]],
	14: [[1, 2, 6, 7, 8], [1, 6, 7, 8], [1, 2, 7, 8], [1, 7, 8]],
	18: [[3]],
	19: [[1]],
	24: [[5]],
	25: [[7]]
};

const isDirt = tile => [ 0, 1, 2, 6, 7, 8, 12, 13, 14, 18, 29, 24, 25, 20, 21, 26, 27, 22, 23, 28, 29 ].includes(tile);

const getBorders = (i, j) => {
	const GET = [ [+1, 0], [+1, -1], [0, -1], [-1, -1], [-1, 0], [-1, +1], [0, +1], [+1, +1] ];
	const getIdx = idx => get(level, i + GET[idx][0], j + GET[idx][1]);
	return range(8).filter(idx => isGrass(getIdx(idx))).map(t => t + 1);
};

const getProperDirtValueForCell = (i, j) => {
	const borders = getBorders(i, j);
	const SIDES = [1, 3, 5, 7];
	const countSides = SIDES.filter(i => borders.includes(i)).length;
	if (countSides === 0) {
		const diagonals = borders.filter(i => !SIDES.includes(i));
		if (diagonals.length === 0) {
			return 7;
		} else if (diagonals.length === 2) {
			const id = diagonals.sort().join('');
			return { '24': 22, '46': 28, '68': 29, '28': 23}[id];
		}
	} else if (countSides === 1) {
		//return 18;
	} else if (countSides === 2) {
	} else if (countSides === 3) {
		return { 1: 27, 3: 26, 5: 21, 7: 20 }[SIDES.find(i => !borders.includes(i))];
	} else if (countSides === 4) {
	}
	return Object.keys(dirts).find(v => dirts[v].some(dtv => arrEq(dtv, borders))) || 7;
}

const fixDirts = () => {
	level.forEach((line, i) => line.forEach((cell, j) => {
		if (isDirt(cell)) {
			const dirtId = getProperDirtValueForCell(i, j);
			if (parseInt(dirtId) === 0) console.log(dirtId);
			level[i][j] = dirtId;
		}
	}));
};
fixDirts();

const Map = class {

	constructor(stage) {
		this.sprites = [];
		this.spriteMap = {};
		this.tileset  = PIXI.BaseTexture.fromImage('images/tileset.png');
		for (let i = 0; i < level.length; i++) {
			for (let j = 0; j < level[i].length; j++) {
				const id = level[i][j];
				const texture = new PIXI.Texture(this.tileset, new PIXI.Rectangle(16*(id % 6), 16*Math.floor(id / 6), 16, 16));
				const sprite = new PIXI.Sprite(texture);
				sprite.x = i*16;
				sprite.y = j*16;
				stage.addChild(sprite);
				this.spriteMap[i + ':' + j] = sprite;
				this.sprites.push(sprite);
			}
		}
	}

	redraw(i, j) {
		const id = level[i][j];
		const texture = new PIXI.Texture(this.tileset, new PIXI.Rectangle(16*(id % 6), 16*Math.floor(id / 6), 16, 16));
		const sprite = this.spriteMap[i + ':' + j];
		sprite.texture = texture;
	}

	find(entity) {
		return [floor(entity.sprite.x / 16), floor(entity.sprite.y / 16)];
	}

	say(pos) {
		const [i, j] = pos;
		console.log(i, j, level[i][j], getBorders(i, j));
	}

	set(pos, block) {
		const [i, j] = pos;
		level[i][j] = block;
		fixDirts();
		for (let di = i - 1; di <= i + 1; di++) {
			for (let dj = j - 1; dj <= j + 1; dj++) {
				this.redraw(di, dj);
			}
		}
	}
};

module.exports = Map;