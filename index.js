var createCamera = require('voxel-camera');

module.exports = function (game) {
    var cameraControl = createCamera(game);
    game.scene.add(cameraControl.camera());
    
    var monitor = new game.THREE.Mesh(
        new game.THREE.CubeGeometry(100, 100, 1),
        new game.THREE.MeshBasicMaterial({
            map: cameraControl.monitor()
        })
    );
window.monitor = monitor;
    
    // Add monitor mesh to the scene
    game.scene.add(monitor);
    
    var item = {
        x: 0, y: 0, z: 0,
        mesh: new game.THREE.Mesh(
            new game.THREE.CubeGeometry(10, 10, 10),
            new game.THREE.MeshBasicMaterial({
                color: 0xff0000,
                ambient: 0xff0000
            })
        )
    };
item.mesh.position.y = 350;
monitor.position.y = 350;
    var offset = new game.THREE.Vector3(0, 350, 0);
    var look = new game.THREE.Vector3(0, 0.2, 1);
window.item = item;
window.offset = offset;
window.look = look;
    
    // Then render the camera on tick
    game.on('tick', function(dt) {
        cameraControl.render(item, offset, look);
    });
};
