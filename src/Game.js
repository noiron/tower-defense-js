import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import Path from './Entity/Path.js';
import Vehicle from './Entity/Vehicle.js';
import SimpleTower from './Entity/SimpleTower.js';
import { calcuteDistance } from './utils/utils';
import { gridWidth, gridHeight } from './constant';

const WIDTH = 800;
const HEIGHT = 640;
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
        this.path.radius = gridWidth / 2;

        this.vehicles = [];
        this.bullets = [];
        this.towers = [];

        this.coordX = 0;
        this.coordY = 0;

        this.vehicleCreatedCount = 0;    // 目前已经创建的vehicle的总数
        this.lastCreatedVehicleTime = new Date();

        const newTowerCoord = [8, 8];
        this.simpleTower = new SimpleTower(
            ctx,
            gridWidth / 2 + newTowerCoord[0] * gridWidth,
            gridHeight / 2 + newTowerCoord[1] * gridHeight,
            this.bullets
        );
        this.towers.push(this.simpleTower);

        this.mode = '';

        this.map = [];
        for (let i = 0; i < 10; i++) {
            this.map[i] = [];
        }

        this.pathCoord = [
            [0, 0], [18, 0],
            [18, 4], [10, 4], [10, 10], [16, 10],
            [16, 14], [-6, 14]
        ]

        this.score = 0;

        // Add points to the path
        this.setPoints();

        this.draw();
    }

    // Define path points
    setPoints() {
        // Set path offset
        // const offset = HEIGHT / 10;

        // this.path.addPoint(offset, offset);
        // this.path.addPoint(offset * 3, offset);
        // this.path.addPoint(offset * 3, offset * 6);
        // this.path.addPoint(offset * 6, offset * 6);
        // this.path.addPoint(offset * 6, offset);
        // this.path.addPoint(WIDTH - offset, offset);
        // this.path.addPoint(WIDTH - offset, offset * 5);
        // this.path.addPoint(WIDTH - offset - 200, offset * 5);
        // this.path.addPoint(WIDTH - offset - 200, offset * 7);
        // this.path.addPoint(WIDTH - offset, offset * 7);
        // this.path.addPoint(WIDTH - offset, HEIGHT - offset);
        // this.path.addPoint(0, HEIGHT - offset);
        // this.path.addPoint(-100, HEIGHT - offset);

        for (let i = 0, len = this.pathCoord.length; i < len; i++) {
            const coord = this.pathCoord[i];
            this.path.addPoint(40 * coord[0] + 20, 40 * coord[1] + 20);
        }
        // this.path.addPoint(-100, HEIGHT - offset);

    }

    // Specify what to draw
    draw() {
        // Clear canvas

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // 
        this.drawMap();

        // Render the path
        this.path.display();

        // 总数小于50，且间隔1000ms以上
        if (this.vehicleCreatedCount < 100 && new Date() - this.lastCreatedVehicleTime > 1000) {
            var mass = Math.random() * 3 + 3;

            var vehicle = new Vehicle(
                vec2.fromValues(
                    gridWidth / 2 + (Math.random() - 0.5) * 5,
                    gridHeight / 2 + (Math.random() - 0.5) * 5
                ),
                mass, ctx
            );

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
        for (let i = 0, len = this.towers.length; i < len; i++) {
            this.towers[i].draw(ctx);
        }

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

        if (this.mode === 'ADD_TOWER') {
            // this.drawGhostTower(ctx, this.cursorX, this.cursorY);
            console.log(this.coordX, this.coordY);
            this.drawGhostTower(ctx, this.coordX * gridWidth + gridWidth / 2, this.coordY * gridHeight + gridHeight / 2);
        }

        // 画面右侧信息的显示
        document.getElementById('score').innerHTML = `Score: ${this.score}`;

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
                    this.score += 100;
                    break;
                }
            }
            if (impact) {
                this.bullets.remove(i); i--;
            }
        }
    }

    createNewTower(x, y) {
        const tower = new SimpleTower(ctx, x, y, this.bullets);
        this.towers.push(tower);
    }

    drawGhostTower(ctx, x, y, towerType) {
        const tower = new SimpleTower(ctx, x, y, this.bullets);
        tower.draw(ctx);
    }

    drawMap() {
        ctx.save();
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#010101';
        ctx.lineWidth = 1;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        // 横纵数目相等
        var size = 20;

        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        // Draw vertical lines
        for (var i = 0; i < size + 1; i++) {
            ctx.moveTo(i * gridWidth, 0);
            ctx.lineTo(i * gridWidth, size * gridHeight);
        }
        ctx.stroke();

        // Draw horizontal lines
        for (i = 0; i < size + 1; i++) {
            ctx.moveTo(0, i * gridWidth);
            ctx.lineTo(size * gridWidth, i * gridWidth);
        }
        ctx.stroke();

        // 给一个格子上色
        function fillGrid(x, y, color) {
            ctx.fillStyle = color || "#666";
            ctx.fillRect(x * gridWidth + 1, y * gridHeight + 1, gridWidth - 2, gridHeight - 2);
        }

        ctx.restore();

    }
}