import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import Path from './Entity/Path.js';
import Vehicle from './Entity/Vehicle.js';
import SimpleTower from './Entity/SimpleTower.js';
import { calcuteDistance } from './utils';

const WIDTH = 800;
const HEIGHT = 600;
const canvas = document.getElementById("drawing");
const ctx = canvas.getContext("2d");

export default class Game {
    constructor() {
        // Init
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        // Create an instance of Path object
        this.path = new Path(ctx);
        // Set path radius
        this.path.radius = 40;

        this.vehicles = [];
        this.bullets = [];

        this.vehicleCreatedCount = 0;    // 目前已经创建的vehicle的总数
        this.lastCreatedVehicleTime = new Date();
        this.simpleTower = new SimpleTower(ctx, 280, 280, this.bullets);

        // Add points to the path
        this.setPoints();

        this.draw();
    }

    // Define path points
    setPoints() {
        // Set path offset
        const offset = HEIGHT / 10;

        this.path.addPoint(offset, offset);
        this.path.addPoint(offset * 3, offset);
        this.path.addPoint(offset * 3, offset * 6);
        this.path.addPoint(offset * 6, offset * 6);
        this.path.addPoint(offset * 6, offset);
        this.path.addPoint(WIDTH - offset, offset);
        this.path.addPoint(WIDTH - offset, offset * 5);
        this.path.addPoint(WIDTH - offset - 200, offset * 5);
        this.path.addPoint(WIDTH - offset - 200, offset * 7);
        this.path.addPoint(WIDTH - offset, offset * 7);
        this.path.addPoint(WIDTH - offset, HEIGHT - offset);
        this.path.addPoint(0, HEIGHT - offset);
        this.path.addPoint(-100, HEIGHT - offset);
    }

    // Specify what to draw
    draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Render the path
        this.path.display();

        // 总数小于50，且间隔1000ms以上
        if (this.vehicleCreatedCount < 50 && new Date() - this.lastCreatedVehicleTime > 1000) {
            var mass = Math.random() * 3 + 3;

            var vehicle = new Vehicle(vec2.fromValues(60, 60), mass, ctx);

            this.vehicles.push(vehicle);
            this.vehicleCreatedCount++;
            this.lastCreatedVehicleTime = new Date();
        }

        for (var i = 0; i < this.vehicles.length; i++) {
            this.vehicles[i].applyBehaviors(this.vehicles, this.path);
            this.vehicles[i].run();

            if (this.vehicles[i].dead === true) {
                this.vehicles.remove(i);
                i--;
            }
        }

        // Draw our tower
        this.simpleTower.draw(ctx);

        // 检查bullet是否与vehicle相撞
        this.detectImpact();

        // 移除出界的bullet，画出剩下的bullet
        for (let i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].start[0] < 0 || this.bullets[i].start[1] < 0 ||
                this.bullets[i].start[0] > WIDTH || this.bullets[i].start[1] > HEIGHT) {
                this.bullets.remove(i);
                i--;
            } else {
                this.bullets[i].draw(ctx);
            }
        }

        if (document.getElementById('vehicleCount')) {
            document.getElementById('vehicleCount').innerHTML = `Vehicle Count: ${this.vehicles.length}, Bullets: ${this.bullets.length}`;
        }

        requestAnimationFrame(() => this.draw(), 100);
    }

    // 循环检测bullet是否和vehicle碰撞
    detectImpact() {
        for (var i = 0; i < this.bullets.length; i++) {
            let impact = false;
            for (var j = 0; j < this.vehicles.length; j++) {

                // 求圆心至bullet的垂足
                let normal = vec2.create();
                let bVec = this.bullets[i].directionVec;
                let aDotB = 1;

                let aVec = vec2.fromValues(
                    this.vehicles[j].location[0] - this.bullets[i].start[0],
                    this.vehicles[j].location[1] - this.bullets[i].start[1]
                );
                vec2.multiply(aDotB, aVec, bVec);
                vec2.scale(bVec, bVec, aDotB);
                vec2.add(normal, this.bullets[i].start, bVec);

                const distance = calcuteDistance(normal[0], normal[1],
                    this.vehicles[j].location[0], this.vehicles[j].location[1]);

                if (distance <= this.vehicles[j].radius) {
                    impact = true;
                    this.vehicles.remove(j); j--;
                    break;
                }
            }
            if (impact) {
                this.bullets.remove(i); i--;
            }
        }
    }
}