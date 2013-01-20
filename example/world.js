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

game.appendTo('#container');
game.on('mousedown', function (pos) {
    if (erase) return explode(pos)
    var size = game.cubeSize;
    
    var c = game.checkBlock(pos);
    var v = c && c.voxelVector;
    var p = v && new game.THREE.Vector3(v.x, v.y, v.z).multiplyScalar(size);
    
    if (c && p.x === 0 && p.y === 100 && p.z === 0) {
        p.y += size;
        var value = game.getBlock(p);
        if (!value) {
            var low = [0,0,0], high = [32,32,32];
            var zeros = function (x,y,z) { return 0 };
            var chunk = voxel.generate(low, high, zeros);
            var vi = game.voxels.voxelIndex({ x: 0, y: 0, z: 0 });
            chunk.voxels[vi] = 3;
            var m = generateMesh(game, chunk, p)
        }
    }
    else {
        game.createBlock(pos, 1)
    }
});

function generateMesh (game, chunk, p) {
    var T = game.THREE;
    var size = game.cubeSize
    var scale = new T.Vector3(size, size, size);
    var mesh = voxelMesh(chunk, voxel.meshers.greedy, scale, T);
    
    mesh.createSurfaceMesh(game.material);
    var smesh = mesh.surfaceMesh;
    
    mesh.setPosition(0, p.y, 0);
    
    var mover = new T.Object3D;
    var rotater = new T.Object3D;
    mover.position.x += size / 2;
    mover.position.z += size / 2;
    
    rotater.add(smesh);
    mover.add(rotater);
    
    game.scene.add(mover);
    game._materialEngine.applyTextures(mesh.geometry);
    
    smesh.position.x = p.x - size / 2;
    smesh.position.z = p.z - size / 2;
    
    servo.on('rotation', function (rot) {
        rotater.rotation.y = rot;
    });
    
    return mesh;
}

window.addEventListener('keydown', ctrlToggle);
window.addEventListener('keyup', ctrlToggle);

var explode = require('voxel-debris')(game);
var erase = true;
function ctrlToggle (ev) { erase = !ev.ctrlKey }
game.requestPointerLock('canvas');

var createServo = require('../')(game);
var servo = createServo({ x: 0, y: 100, z: 0 });
game.setBlock({ x: 0, y: 75, z: 0 }, 2);

setInterval(function () {
    servo.rotate(Math.PI / 64);
}, 50);
