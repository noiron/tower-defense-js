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
    path.addPoint(0, HEIGHT - offset);
    path.addPoint(-100, HEIGHT - offset);
}

// Add points to the path
setPoints();

let vehicles = [];
let bullets = [];

let vehicleCreatedCount = 0;    // 目前已经创建的vehicle的总数
let lastCreatedVehicleTime = new Date();
let simpleTower = new SimpleTower(ctx, 280, 280, bullets);

// Specify what to draw
function draw() {
    'use strict';

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Render the path
    path.display();

    // 总数小于50，且间隔1000ms以上
    if (vehicleCreatedCount < 50 && new Date() - lastCreatedVehicleTime > 1000) {
        var mass = Math.random() * 3 + 3;

        var vehicle = new Vehicle(vec2.fromValues(60, 60), mass, ctx);

        vehicles.push(vehicle);
        vehicleCreatedCount++;
        lastCreatedVehicleTime = new Date();
    }

    for (var i = 0; i < vehicles.length; i++) {
        vehicles[i].applyBehaviors(vehicles, path);
        vehicles[i].run();

        if (vehicles[i].dead === true) {
            vehicles.remove(i);
            i--;
        }
    }

    // Draw our tower
    simpleTower.draw(ctx);

    // 检查bullet是否与vehicle相撞
    detectImpact();

    // 移除出界的bullet，画出剩下的bullet
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].start[0] < 0 || bullets[i].start[1] < 0 ||
            bullets[i].start[0] > WIDTH || bullets[i].start[1] > HEIGHT) {
            bullets.remove(i);
            i--;
        } else {
            bullets[i].draw(ctx);
        }
    }

    if (document.getElementById('vehicleCount')) {
        document.getElementById('vehicleCount').innerHTML = `Vehicle Count: ${vehicles.length}, Bullets: ${bullets.length}`;
    }

    requestAnimationFrame(draw, 100);
}

draw();

// 循环检测bullet是否和vehicle碰撞
function detectImpact() {
    for (var i = 0; i < bullets.length; i++) {
        let impact = false;
        for (var j = 0; j < vehicles.length; j++) {
            // const distance = calcuteDistance(bullets[i].end[0], bullets[i].end[1],
            //     vehicles[j].location[0], vehicles[j].location[1]);

            // 求圆心至bullet的垂足
            let normal = vec2.create();
            let bVec = bullets[i].directionVec;
            let aDotB = 1;

            let aVec = vec2.fromValues(
                vehicles[j].location[0] - bullets[i].start[0],
                vehicles[j].location[1] - bullets[i].start[1]
            );
            vec2.multiply(aDotB, aVec, bVec);
            vec2.scale(bVec, bVec, aDotB);
            vec2.add(normal, bullets[i].start, bVec);

            const distance = calcuteDistance(normal[0], normal[1],
                vehicles[j].location[0], vehicles[j].location[1]);

            if (distance <= vehicles[j].radius) {
                impact = true;
                vehicles.remove(j); j--;
                break;
            }
        }
        if (impact) {
            bullets.remove(i); i--;
        }
    }
}

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
node.setAttribute("id", "vehicleCount");
var textnode = document.createTextNode(`Vehicle Count: ${vehicles.length}`);
node.appendChild(textnode);
document.body.appendChild(node);

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


function calcuteDistance(x1, y1, x2, y2) {
    const result = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return result;
}