var createCamera = require('voxel-camera');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = function (game) {
    return function (opts) {
        return new Portal(game, opts || {});
    };
};

function Portal (game, opts) {
    var T = game.THREE;
    this.game = game;
    
    var pos = new T.Vector3(opts.x || 0, opts.y || 0, opts.z || 0);
    this.position = pos
    
    var width = opts.width === undefined ? 100 : opts.width;
    this.width = width;
    var height = opts.height === undefined ? 50 : opts.height;
    this.height = height;
    
    var camera = this.camera = createCamera(game);
    game.scene.add(camera.camera());
    
    var monitor = new game.THREE.Mesh(
        new game.THREE.CubeGeometry(width, height, 0.5),
        new game.THREE.MeshBasicMaterial({
            map: camera.monitor()
        })
    );
    var p = monitor.position;
    p.x = pos.x; p.y = pos.y; p.z = pos.z;
    game.scene.add(monitor);
}

inherits(Portal, EventEmitter);

Portal.prototype.show = function (target, d) {
    var self = this;
    var T = self.game.THREE;
    
    var pos = target.position || target;
    if (!d) d = new T.Vector3(0, 0, 1)
    else d = new T.Vector3(d.x, d.y, d.z)
    
    var item = {
        mesh: new T.Mesh(
            new T.CubeGeometry(10, 10, 10)
        )
    };
    var p = item.mesh.position;
    p.x = pos.x; p.y = pos.y; p.z = pos.z;
    
    d.multiplyScalar(50);
    var offset = new T.Vector3(pos.x, pos.y, pos.z).addSelf(d);
    var look = new T.Vector3().add(offset, d);
    
    self.game.on('tick', function(dt) {
        self.camera.render(item, offset, look);
        var pos = self.game.controls.yawObject.position;
    });
};
