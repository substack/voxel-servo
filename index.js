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
    
    var control = this.control = createCamera(game);
    this.camera = control.camera();
    game.scene.add(this.camera);
    
    this.monitor = new game.THREE.Mesh(
        new game.THREE.CubeGeometry(width, height, 1),
        new game.THREE.MeshBasicMaterial({
            map: control.monitor()
        })
    );
    this.monitor.geometry.computeBoundingBox();
    var p = this.monitor.position;
    p.x = pos.x; p.y = pos.y; p.z = pos.z;
    game.scene.add(this.monitor);
}

inherits(Portal, EventEmitter);

var inside = [];

Portal.prototype.show = function (target, d) {
    var self = this;
    var T = self.game.THREE;
    
    var pos = target.position || target;
    pos = new T.Vector3(pos.x, pos.y, pos.z);
    var d = new T.Vector3(d.x, d.y, d.z).normalize();
    
    var item = {
        mesh: new T.Mesh(
            new T.CubeGeometry(10, 10, 10)
        )
    };
    var p = item.mesh.position;
    p.x = pos.x; p.y = pos.y; p.z = pos.z;
    
    var box = self.monitor.geometry.boundingBox;
    var index = inside.length;
    inside.push(false);
    
    if (self._ontick) self.game.removeListener('tick', self._ontick);
    self._ontick = function (dt) {
        var pt = self.game.controls.yawObject.position;
        var delta = pos.clone().subSelf(pt);
        var offset = pos.clone().subSelf(delta);
        var dir = delta.clone().normalize();
        //var look = pos.clone();
        var look = offset.clone().subSelf(d);
        
        self.control.render(item, offset, look);
        
        var rel = pt.clone().subSelf(self.position);
        if (box.containsPoint(rel)) {
            var already = inside.some(Boolean);
            inside[index] = true;
            if (already) return;
            self.emit('enter');
        }
        else {
            inside[index] = false;
        }
    };
    self.game.on('tick', self._ontick);
};
