import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import Path from './Entity/Path.js';
import SimpleTower from './Entity/SimpleTower.js';
import BulletTower from './Entity/BulletTower.js';
import Enemy from './Entity/Enemy';
import Map from './Entity/Map';
import { calcuteDistance } from './utils/utils';
import { gridWidth, gridHeight, gridNumX, gridNumY, towerCost } from './utils/constant';
import globalId from './id';

const WIDTH = 800;
const HEIGHT = 640;
const canvas = document.getElementById("drawing");
const ctx = canvas.getContext("2d");

export default class Game {
    constructor() {
        // Init
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        this.genId = 0;

        this.bullets = [];
        this.towers = [];
        this.enemies = [];

        this.ctx = ctx;
        this.money = 2000;
        this.coordX = 0;
        this.coordY = 0;
        this.enemyCreatedCount = 0;    // 目前已经创建的enemy的总数
        this.lastCreatedEnemyTime = new Date();

        this.pathCoord = [
            [0, 0], [18, 0],
            [18, 4], [10, 4], [10, 10], [16, 10],
            [16, 14], [-1, 14]
        ];

        const newTowerCoord = [8, 3];
        this.map = new Map({
            ctx,
            WIDTH,
            HEIGHT,
            newTowerCoord,
            pathCoord: this.pathCoord,
        })

        const tower = new SimpleTower({
            ctx,
            x: gridWidth / 2 + newTowerCoord[0] * gridWidth,
            y: gridHeight / 2 + newTowerCoord[1] * gridHeight,
            bullets: this.bullets,
        });
        this.towers.push(tower);

        this.mode = '';
        this.score = 0;

        // 当前是否选中塔
        this.towerSelect = false;
        this.towerSelectIndex = -1;
        this.towerSelectId = -1;

        this.draw();
    }

    // Specify what to draw
    draw() {
        this.map.draw({
            towers: this.towers,
            towerSelect: this.towerSelect,
            towerSelectIndex: this.towerSelectIndex
        });

        // 总数小于50，且间隔 x ms以上
        if (this.enemyCreatedCount < 20 && new Date() - this.lastCreatedEnemyTime > 500) {
            var enemy = new Enemy({
                id: globalId.genId(),
                x: gridWidth / 2 + (Math.random() - 0.5) * 5,
                y: gridHeight / 2 + (Math.random() - 0.5) * 5,
                ctx: ctx
            });

            this.enemies.push(enemy);
            this.enemyCreatedCount++;
            this.lastCreatedEnemyTime = new Date();
        }

        this.enemies.forEach((enemy, index) => {
            enemy.step({ path: this.pathCoord });
            enemy.draw();

            if (enemy.dead) {
                this.enemies.remove(index);
            }
        });

        // Draw our tower
        this.towers.forEach((tower, index) => {
            if (this.towerSelect && this.towerSelectIndex === index) {
                // 选中的塔需画出其范围
                tower.selected = true;
            } else {
                tower.selected = false;
            }
            tower.draw(ctx)
        });

        // 确定 bullet tower 的目标
        for (let i = 0, len = this.towers.length; i < len; i++) {
            this.towers[i].findTarget(this.enemies);
            if (this.towers[i].target !== null) {

                const target = this.towers[i].target;
                // 调整其朝向
                this.towers[i].directionVec = vec2.fromValues(
                    target.x - this.towers[i].x,
                    target.y - this.towers[i].y
                );

                this.towers[i].direction = Math.atan2(target.y - this.towers[i].y,
                    target.x - this.towers[i].x) * (180 / Math.PI);
            }
        }


        // 检查bullet是否与vehicle相撞
        this.detectImpact();

        // 移除出界的bullet，画出剩下的bullet
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            if (bullet.type === 'line') {  // 直线子弹
                if (bullet.start[0] < 0 || bullet.start[1] < 0 ||
                    bullet.start[0] > WIDTH || bullet.start[1] > HEIGHT) {
                    this.bullets.remove(i);
                    i--;
                } else {
                    bullet.draw(ctx, this.enemies);
                }
            } else if (bullet.type === 'circle') {
                if (bullet.x < 0 || bullet.y < 0 ||
                    bullet.x > WIDTH || bullet.y > HEIGHT) {
                    this.bullets.remove(i);
                    i--;
                } else {
                    bullet.draw(ctx, this.enemies);
                }
            }
        }

        if (this.mode === 'ADD_TOWER') {    // 添加塔模式
            if (0 <= this.coordX && this.coordX < gridNumX
                && 0 <= this.coordY && this.coordY < gridNumY) {
                if (this.map.coord[this.coordX][this.coordY] !== 'T') {  // 该位置没有塔
                    this.drawGhostTower(
                        ctx,
                        this.coordX * gridWidth + gridWidth / 2,
                        this.coordY * gridHeight + gridHeight / 2);
                }
            }
        }

        this.displayInfo();

        requestAnimationFrame(() => this.draw(), 100);
    }

    // 循环检测bullet是否和vehicle碰撞
    detectImpact() {
        for (var i = 0; i < this.bullets.length; i++) {
            let impact = false;
            let distance = 0;

            for (var j = 0; j < this.enemies.length; j++) {

                if (this.bullets[i].type === 'line') {
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

                    distance = calcuteDistance(normal[0], normal[1],
                        this.enemies[j].x, this.enemies[j].y);
                } else {
                    distance = calcuteDistance(this.bullets[i].x, this.bullets[i].y, this.enemies[j].x, this.enemies[j].y)
                }

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
        if (this.map.coord[coordX][coordY] === 'T') {
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
                tower = new SimpleTower({
                    ctx, x, y,
                    bullets: this.bullets,
                });
                break;
            case 'BULLET':
                tower = new BulletTower({ ctx, x, y, bullets: this.bullets });
                break;
            default:
                tower = new BulletTower({ ctx, x, y, bullets: this.bullets });
        }

        this.map.coord[coordX][coordY] = 'T';
        this.money -= cost;
        this.towers.push(tower);
    }

    sellTower(index = this.towerSelectIndex) {
        const coordX = this.towers[index].coordX;
        const coordY = this.towers[index].coordY;
        this.towers.remove(index);
        console.log(index);
        this.map.coord[coordX][coordY] = '';

        this.money += 400;
        this.towerSelect = false;
        this.towerSelectIndex = -1;
    }

    drawGhostTower(ctx, x, y, towerType) {
        const tower = new SimpleTower({ ctx, x, y, bullets: this.bullets, selected: true });
        tower.draw(ctx);
    }


    displayInfo() {
        // 画面信息的显示
        if (document.getElementById('enemyCount')) {
            document.getElementById('enemyCount').innerHTML = `Enemy Count: ${this.enemies.length}, Bullets: ${this.bullets.length}`;
        }

        document.getElementById('score').innerHTML = `Score: ${this.score}`;
        document.getElementById('money').innerHTML = `Money: ${this.money}`;
    }
}