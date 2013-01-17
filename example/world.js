var createEngine = require('voxel-engine');

var game = createEngine({
    generate: function(x, y, z) {
        var height = 2;
        var d = Math.sqrt(x*x + y*y + z*z);
        return d < 20 && y >= 0 && y <= 10;
    },
    texturePath: './textures/',
    materials: [ 'grass_top', 'tree_side', 'leaves_opaque' ]
});
game.appendTo('#container');

var createPortal = require('../')(game);
var explode = require('voxel-debris')(game);
window.game = game;

game.on('mousedown', function (pos) {
    if (erase) explode(pos)
    else game.createBlock(pos, 1)
});

window.addEventListener('keydown', ctrlToggle);
window.addEventListener('keyup', ctrlToggle);

var erase = true;
function ctrlToggle (ev) { erase = !ev.ctrlKey }
game.requestPointerLock('canvas');
