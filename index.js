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
    const map = new Map(stage);
    objs.push(map);
    objs.push(new Player(stage));

    (animate = () => {
        requestAnimationFrame(animate);
        position.tick();
        map.update(position);
        renderer.render(stage);
    })();
};

PIXI.loader.add('images/tileset.png').load(setup);