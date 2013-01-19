var createEngine = require('voxel-engine');

var game = createEngine({
    generate: function(x, y, z) {
        var d = Math.sqrt(x*x + y*y + z*z);
        return d < 20 && y >= -10 && (y < 0 || y*y <= 0.5*x*x + z*z / 64);
    },
    texturePath: './textures/',
    materials: [ 'grass_top', 'obsidian', 'netherrack' ],
    startingPosition: [ 0, 100, 0 ]
});
game.appendTo('#container');

var explode = require('voxel-debris')(game);
var erase = true;
function ctrlToggle (ev) { erase = !ev.ctrlKey }
game.requestPointerLock('canvas');

for (var z = -225; z <= 200; z+= 425) {
    for (var y = 50; y <= 125; y += 25) {
        for (var x = -75; x <= 50; x += 25) {
            game.setBlock({ x: x, y: y, z: z }, z < 0 ? 2 : 3);
        }
    }
}

var createPortal = require('../')(game);

var a = createPortal({
    x: 0, y: 100, z: 200,
    width: 100, height: 50
});
var b = createPortal({
    x: 0, y: 100, z: -200,
    width: 100, height: 50
});

a.show(b, { x: 0, y: 0, z: 1 });
b.show(a, { x: 0, y: 0, z: -1 });

a.on('enter', function () {
    game.moveToPosition(b.position);
});

b.on('enter', function () {
    game.moveToPosition(a.position);
});
window.a = a;
window.b = b;

game.on('mousedown', function (pos) {
    if (erase) explode(pos)
    else game.createBlock(pos, 1)
});

window.addEventListener('keydown', ctrlToggle);
window.addEventListener('keyup', ctrlToggle);

