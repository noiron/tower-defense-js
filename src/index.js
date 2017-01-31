// var vec2 = require('gl-matrix/src/gl-matrix/vec2');
import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import Path from './Entity/Path.js';
import Vehicle from './Entity/Vehicle.js';
import SimpleTower from './Entity/SimpleTower.js';

// Make sure v is smaller than high
vec2.limit = function (out, v, high) {
    'use strict';

    var x = v[0],
        y = v[1];

    var len = x * x + y * y;

    if (len > high * high && len > 0) {
        out[0] = x;
        out[1] = y;
        vec2.normalize(out, out);
        vec2.scale(out, out, high);
    }
    return out;
};

// Init
var canvas = document.getElementById("drawing"),
    ctx = canvas.getContext("2d");

// var WIDTH = window.innerWidth;
// var HEIGHT = window.innerHeight;
var WIDTH = 800;
var HEIGHT = 600;

canvas.width = WIDTH;
canvas.height = HEIGHT;

// Create an instance of Path object
var path = new Path(ctx);

// Set path radius
path.radius = 40;

// Define path points
function setPoints() {
    'use strict';

    // Set path offset
    var offset = HEIGHT / 10;

    path.addPoint(offset, offset);
    path.addPoint(offset * 3, offset);
    path.addPoint(offset * 3, offset * 6);
    path.addPoint(offset * 6, offset * 6);
    path.addPoint(offset * 6, offset);
    path.addPoint(WIDTH - offset, offset);
    path.addPoint(WIDTH - offset, offset * 5);
    path.addPoint(WIDTH - offset - 200, offset * 5);
    path.addPoint(WIDTH - offset - 200, offset * 7);
    path.addPoint(WIDTH - offset, offset * 7);
    path.addPoint(WIDTH - offset, HEIGHT - offset);
    path.addPoint(offset, HEIGHT - offset);
    // path.addPoint(offset, offset);
}

// Add points to the path
setPoints();

var vehicles = [];
var bullets = [];

for (var i = 0; i < 50; i++) {
    var mass = Math.random() * 4 + 1;

    var vehicle = new Vehicle(vec2.fromValues(WIDTH * Math.random(), HEIGHT * Math.random()), mass, ctx);

    vehicles.push(vehicle);
}

var simpleTower = new SimpleTower(ctx, 280, 280, bullets);
    // simpleTower.shoot();

// Specify what to draw
function draw() {
    'use strict';

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Render the path
    path.display();

    for (var i = 0; i < vehicles.length; i++) {
        vehicles[i].applyBehaviors(vehicles, path);
        vehicles[i].run();
    }


    // Draw our tower
    simpleTower.draw(ctx);


    requestAnimationFrame(draw, 10000000000);
}

draw();

// Handle things appropriately on resize
function onResize() {
    'use strict';

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    path.points = [];
    setPoints();
}

// window.addEventListener('resize', onResize, false);


var node = document.createElement("p");                 
var textnode = document.createTextNode(`Vehicle Count: ${vehicles.length}`);         
node.appendChild(textnode);                              
document.body.appendChild(node);     

// var vehicleCountNode = document.createElement("p").append(document.createTextNode("")); 

// document.body.appendChild(vehicleCountNode);
