const PIXI = require('pixi.js');

const Player = require('./player.js');
const Map = require('./map.js');

const setup = () => {
    const texture = PIXI.utils.TextureCache['images/tileset.png'];

    const renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
        antialias: true,
        autoResize: true,
        transparent: true,
        resolution: 2
    });
     
    document.body.appendChild(renderer.view);

    const stage = new PIXI.Container(); 
    const objs = [];
    objs.push(new Map(stage, texture));
    objs.push(new Player(stage));

    (animate = () => {
        requestAnimationFrame(animate);
        objs.forEach(obj => obj.tick());
        renderer.render(stage);
    })();
};

PIXI.loader.add('images/tileset.png').load(setup);