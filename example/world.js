var voxelMesh = require('voxel-mesh');
var voxel = require('voxel');

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

window.game = game;
game.appendTo('#container');
game.on('mousedown', function (pos) {
    if (erase) return explode(pos)
    var size = game.cubeSize;
    
    var c = game.checkBlock(pos);
    var v = c && c.voxelVector;
    var p = v && new game.THREE.Vector3(v.x, v.y, v.z).multiplyScalar(size);
    
    if (c && p.x === 0 && p.y === 75 && p.z === 0) {
console.log('point!', p.x, p.y, p.z)
        p.y += size;
        var value = game.getBlock(p);
        if (!value) {
            var vi = game.voxels.voxelIndex({ x: 0, y: 0, z: 0 });
            var detached = game.detachChunk();
            detached.set('0|0|0', vi, 3);
            
            detached.position.x = p.x
            detached.position.y = p.y
            detached.position.z = p.z
            
            servo.on('rotation', function (rot) {
                detached.rotation.y = rot;
            });
        }
    }
    else {
        game.createBlock(pos, 1)
    }
});

window.addEventListener('keydown', ctrlToggle);
window.addEventListener('keyup', ctrlToggle);

var explode = require('voxel-debris')(game);
var erase = true;
function ctrlToggle (ev) { erase = !ev.ctrlKey }
game.requestPointerLock('canvas');

var createServo = require('../')(game);
var servo = createServo({ x: 0, y: 75, z: 0 });

setInterval(function () {
    servo.rotate(Math.PI / 64);
}, 50);
