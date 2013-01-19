var createEngine = require('voxel-engine');
var game = createEngine({
    generate: function(x, y, z) {
        var d = Math.sqrt(x*x + y*y + z*z);
        return d < 20 && y >= -10 && (y < 3 || y*y <= 0.5*x*x + z*z / 64);
    },
    texturePath: './textures/',
    materials: [ 'grass_top', 'obsidian', 'netherrack' ],
    startingPosition: [ 0, 200, 0 ]
});
game.appendTo('#container');
game.on('mousedown', function (pos) {
    if (erase) explode(pos)
    else game.createBlock(pos, 1)
});
window.addEventListener('keydown', ctrlToggle);
window.addEventListener('keyup', ctrlToggle);

var explode = require('voxel-debris')(game);
var erase = true;
function ctrlToggle (ev) { erase = !ev.ctrlKey }
game.requestPointerLock('canvas');

var createServo = require('../')(game);
var servo = createServo({ x: 0, y: 100, z: 0 });
game.setBlock({ x: 0, y: 75, z: 0 }, 2);
window.servo = servo;

setInterval(function () {
    servo.rotate(Math.PI / 64);
}, 50);
