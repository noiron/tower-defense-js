import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import Path from './Entity/Path.js';
import SimpleTower from './Entity/SimpleTower.js';
import BulletTower from './Entity/BulletTower.js';
import Enemy from './Entity/Enemy';
import { calcuteDistance } from './utils/utils';
import { gridWidth, gridHeight, gridNumX, gridNumY, towerCost } from './constant';

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

        this.bullets = [];
        this.towers = [];
        this.enemies = [];

        this.ctx = ctx;

        this.money = 2000;

        this.coordX = 0;
        this.coordY = 0;

        this.enemyCreatedCount = 0;    // 目前已经创建的enemy的总数
        this.lastCreatedEnemyTime = new Date();

        this.map = [];
        for (let i = 0; i < gridNumX; i++) {
            this.map[i] = [];
        }

        const newTowerCoord = [8, 8];
        // this.simpleTower = new SimpleTower(
        this.simpleTower = new BulletTower(
            ctx,
            gridWidth / 2 + newTowerCoord[0] * gridWidth,
            gridHeight / 2 + newTowerCoord[1] * gridHeight,
            this.bullets,
            this
        );
        this.map[newTowerCoord[0]][newTowerCoord[1]] = 'T';
        this.towers.push(this.simpleTower);

        this.mode = '';

        this.pathCoord = [
            [0, 0], [18, 0],
            [18, 4], [10, 4], [10, 10], [16, 10],
            [16, 14], [-6, 14]
        ]

        this.score = 0;

        // 当前是否选中塔
        this.towerSelect = false;
        this.towerSelectIndex = -1;

        // Add points to the path
        this.setPoints();

        this.draw();
    }

    // Define path points
    setPoints() {
        for (let i = 0, len = this.pathCoord.length; i < len; i++) {
            const coord = this.pathCoord[i];
            this.path.addPoint(40 * coord[0] + 20, 40 * coord[1] + 20);
        }
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
        if (this.enemyCreatedCount < 20 && new Date() - this.lastCreatedEnemyTime > 1000) {
            var enemy = new Enemy({
                x: gridWidth / 2 + (Math.random() - 0.5) * 5,
                y: gridHeight / 2 + (Math.random() - 0.5) * 5,
                ctx: ctx
            });

            this.enemies.push(enemy);
            this.enemyCreatedCount++;
            this.lastCreatedEnemyTime = new Date();
        }

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].step({path: this.pathCoord});
            this.enemies[i].draw();

            if (this.enemies[i].dead === true) {
                this.enemies.remove(i);
                i--;
            }
        }

        // Draw our tower
        for (let i = 0, len = this.towers.length; i < len; i++) {
            this.towers[i].draw(ctx);
        }

        // 确定 bullet tower 的目标
        for (let i = 0, len = this.towers.length; i < len; i++) {
            const index = this.towers[i].findTarget(this.enemies);
            if (this.towers[i].targetIndex != -1) {
                // console.log(`tower ${i} have target ${this.towers[i].targetIndex}`);

                const target = this.enemies[this.towers[i].targetIndex];
                // 调整其朝向
                this.towers[i].directionVec = vec2.fromValues(
                    target.x - this.towers[i].x,
                    target.y - this.towers[i].y
                );

                const theta = Math.atan2(target.y - this.towers[i].y,
                    target.x - this.towers[i].x);
                this.towers[i].direction = theta < 0 ? theta * 180 / Math.PI : (theta + 1) * 180 / Math.PI;
            }
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

        if (document.getElementById('enemyCount')) {
            document.getElementById('enemyCount').innerHTML = `Enemy Count: ${this.enemies.length}, Bullets: ${this.bullets.length}`;
        }

        if (this.mode === 'ADD_TOWER') {    // 添加塔模式
            if (0 <= this.coordX && this.coordX < gridNumX && 0 <= this.coordY && this.coordY < gridNumY) {
                if (this.map[this.coordX][this.coordY] !== 'T') {  // 该位置没有塔
                    this.drawGhostTower(
                        ctx,
                        this.coordX * gridWidth + gridWidth / 2,
                        this.coordY * gridHeight + gridHeight / 2);
                }
            }
        }

        // 画面右侧信息的显示
        document.getElementById('score').innerHTML = `Score: ${this.score}`;
        document.getElementById('money').innerHTML = `Money: ${this.money}`;

        requestAnimationFrame(() => this.draw(), 100);

        // setTimeout( () => {
        //     requestAnimationFrame(() => this.draw());
        // }, 1000 / 100);
    }

    // 循环检测bullet是否和vehicle碰撞
    detectImpact() {
        for (var i = 0; i < this.bullets.length; i++) {
            let impact = false;
            for (var j = 0; j < this.enemies.length; j++) {

                // 求圆心至bullet的垂足
                let normal = vec2.create();
                let bVec = this.bullets[i].directionVec;
                let aDotB = 1;

                let aVec = vec2.fromValues(
                    this.enemies[j].x - this.bullets[i].start[0],
                    this.enemies[j].y - this.bullets[i].start[1]
                );
                vec2.multiply(aDotB, aVec, bVec);
                vec2.scale(bVec, bVec, aDotB);
                vec2.add(normal, this.bullets[i].start, bVec);

                const distance = calcuteDistance(normal[0], normal[1],
                    this.enemies[j].x, this.enemies[j].y);

                if (distance <= this.enemies[j].radius + 5) {
                    impact = true;
                    this.enemies.remove(j); j--;
                    this.score += 100;
                    break;
                }
            }
            if (impact) {
                this.bullets.remove(i); i--;
            }
        }
    }

    /**
     * 创建一个新的tower
     * @param {Number} coordX x轴的坐标  
     * @param {Number} coordY y轴的坐标
     */
    createNewTower(coordX, coordY, towerType) {

        // 检查当前位置是否已有物体
        if (this.map[coordX][coordY] === 'T') {
            console.log('You can not place tower here!');
            return -1;
        }

        const cost = towerCost.simpleTower;
        // 检查是否有足够金钱
        if (this.money - cost < 0) {
            console.log('You do not have enough money.');
            return -1;
        }

        const x = coordX * gridWidth + gridWidth / 2;
        const y = coordY * gridWidth + gridWidth / 2;

        let tower = null;
        switch (towerType) {
            case 'SIMPLE':
                new SimpleTower(ctx, x, y, this.bullets, this);
            case 'BULLET':
                tower = new BulletTower(ctx, x, y, this.bullets, this);
            default:
                tower = new BulletTower(ctx, x, y, this.bullets, this);
        }

        // const tower = new SimpleTower(ctx, x, y, this.bullets);
        // const tower = new BulletTower(ctx, x, y, this.bullets);
        this.map[coordX][coordY] = 'T';
        this.money -= cost;
        this.towers.push(tower);
    }

    sellTower(index = this.towerSelectIndex) {
        const coordX = this.towers[index].coordX;
        const coordY = this.towers[index].coordY;
        this.towers.remove(index);
        this.map[coordX][coordY] = '';

        this.money += 400;
        this.towerSelect = false;
        this.towerSelectIndex = -1;
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

        // 当前选中的格子突出显示
        if (this.towerSelect) {
            const coordX = this.towers[this.towerSelectIndex].coordX;
            const coordY = this.towers[this.towerSelectIndex].coordY;

            fillGrid(coordX, coordY, 'red')
        }

        // 给一个格子上色
        function fillGrid(x, y, color) {
            ctx.fillStyle = color || "#666";
            ctx.fillRect(x * gridWidth + 1, y * gridHeight + 1, gridWidth - 2, gridHeight - 2);
        }

        ctx.restore();

    }
}