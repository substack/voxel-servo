# voxel-portal

Create teleport portals for [voxel.js](http://voxeljs.com)
textured with the camera view at the destination.

# example

[View this example.](http://substack.net/projects/voxel-portal/)

``` js
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

// build back plates for the portals out of obsidian and netherrack
for (var z = -225; z <= 200; z+= 425) {
    for (var y = 50; y <= 125; y += 25) {
        for (var x = -75; x <= 50; x += 25) {
            game.setBlock({ x: x, y: y, z: z }, z < 0 ? 2 : 3);
        }
    }
}

var createPortal = require('voxel-portal')(game);

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
    console.log('ENTER A');
    game.moveToPosition(b.position);
});

b.on('enter', function () {
    console.log('ENTER B');
    game.moveToPosition(a.position);
});

game.on('mousedown', function (pos) {
    if (erase) explode(pos)
    else game.createBlock(pos, 1)
});

window.addEventListener('keydown', ctrlToggle);
window.addEventListener('keyup', ctrlToggle);
```

# methods

``` js
var voxelPortal = require('voxel-portal')
```

## var createPortal = voxelPortal(game)

Return a function for making portals given a
[voxel-engine](https://github.com/maxogden/voxel-engine) game instance.

## var portal = createPortal(opts)

Create a portal `opts.width` width and `opts.height` tall at
the coordinate `(opts.x, opts.y, opts.z)`.

## portal.show(target, direction)

Show the view from `target` looking with the `direction` vector.

`target` can have a `.position` or it can have `.x`, `.y`, and `.z` fields
itself directly.

# events

## portal.on('enter', function () {})

When a player's position intersects the portal bounding box, this event fires.

It's up to you to teleport the player from here.

# install

With [npm](https://npmjs.org) do:

```
npm install voxel-portal
```

Use [browserify](http://browserify.org) to `require('voxel-portal')`.

# license

MIT
