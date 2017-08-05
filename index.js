const PIXI = require('pixi.js');

const Player = require('./player.js');
const Map = require('./map.js');
const movement = require('./movement');

const setup = () => {
    const position = movement();

    const renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
        antialias: true,
        autoResize: true,
        transparent: true,
        resolution: 2
    });
     
    document.body.appendChild(renderer.view);

    const stage = new PIXI.Container(); 
    const objs = [];

    objs.push(new Map(stage));

    const player = new Player(stage);
    objs.push(player);

    stage.x = 0;
    stage.y = 0;

    (animate = () => {
        requestAnimationFrame(animate);
        player.update(position);
        const camera = player.camera();
        stage.x = camera.x;
        stage.y = camera.y;
        renderer.render(stage);
    })();
};

PIXI.loader.add('images/tileset.png').load(setup);