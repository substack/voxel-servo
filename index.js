var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = function (game) {
    return function (opts) {
        return new Servo(game, opts || {});
    };
};

function Servo (game, opts) {
    var T = game.THREE;
    this.game = game;
    
    var pos = opts.position || opts;
    pos = new T.Vector3(pos.x || 0, pos.y || 0, pos.z || 0);
    this.position = pos
    
    var size = game.cubeSize;
    
    pos.x += size / 2;
    pos.y += size / 4;
    pos.z += size / 2;
    
    this.base = createHalf(0xc0c0c0);
    game.scene.add(this.base);
    
    pos.y += size / 2;
    
    this.rotor = createHalf(0xf08000);
    game.scene.add(this.rotor);
    
    function createHalf (color) {
        var m = new T.Mesh(
            new T.CubeGeometry(size, size / 2, size),
            new T.MeshLambertMaterial({
                color: color,
                ambient: color
            })
        );
        m.translateX(pos.x);
        m.translateY(pos.y);
        m.translateZ(pos.z);
        return m;
    }
}

inherits(Servo, EventEmitter);

Servo.prototype.rotate = function (radians) {
    this.rotor.rotation.y += radians;
};
