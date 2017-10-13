import { vec2 } from 'gl-matrix';
import Path from './Entity/Path.js';
import BaseTower from './Entity/tower/BaseTower.js';
import BulletTower from './Entity/tower/BulletTower.js';
import LaserTower from './Entity/tower/LaserTower.js';
import Enemy from './Entity/Enemy';
import Map from './Entity/Map';
import Wave from './Wave';
import { calcuteDistance } from './utils/utils';
import { gridWidth, gridHeight, gridNumX, gridNumY, towerCost } from './utils/constant';
import globalId from './id';

const WIDTH = 800;
const HEIGHT = 640;
const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');

const gameOverEle = document.getElementById('game-over');

export default class Game {
    constructor(opt) {
        // Init
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        this.element = opt.element;

        this.genId = 0;

        this.bullets = [];
        this.towers = [];
        this.enemies = [];

        this.ctx = ctx;
        this.money = 5000;
        this.coordX = 0;
        this.coordY = 0;
        this.enemyCreatedCount = 0;    // 目前已经创建的enemy的总数
        this.lastCreatedEnemyTime = new Date();

        this.pathCoord = [
            [0, 0], [18, 0], [18, 4], [10, 4], [10, 10], [16, 10], [16, 14], [-1, 14]
        ];

        const newTowerCoord = [8, 3];
        this.map = new Map({
            ctx,
            WIDTH,
            HEIGHT,
            newTowerCoord,
            pathCoord: this.pathCoord,
        });

        // 放置一个初始状态下的塔
        const tower = new BaseTower({
            ctx,
            x: gridWidth / 2 + newTowerCoord[0] * gridWidth,
            y: gridHeight / 2 + newTowerCoord[1] * gridHeight,
            bullets: this.bullets,
        });
        this.towers.push(tower);

        this.mode = '';
        this.addTowerType = 'BASE';
        this.score = 0;
        this.life = 100;

        // 当前是否选中塔
        this.towerSelect = false;
        this.towerSelectIndex = -1;
        this.towerSelectId = -1;

        this.status = 'running';

        this.wave = -1;  // 当前第几波
        this.waves = [];

        this.draw();
        this.bindEvent();
    }

    // Specify what to draw
    draw() {
        if (this.status === 'gameOver') {
            // gameOverEle.style.display = 'block';
            return;
        }

        if (this.status === 'pause') {
            return;
        }

        this.map.draw({
            towers: this.towers,
            towerSelect: this.towerSelect,
            towerSelectIndex: this.towerSelectIndex
        });

        if (this.waves.length === 0 || this.waves[this.wave].waveFinish()) {
            this.generateWave();
            // this.waves[0].waveFinish();
        }

        // 生成enemy
        // 总数小于50，且间隔 x ms以上
        if (this.wave < 100 && new Date() - this.lastCreatedEnemyTime > 500) {
            const cfg = this.waves[this.wave].generateEnemy();
            var enemy = new Enemy({
                id: globalId.genId(),
                ctx: ctx,
                x: gridWidth / 2 + (Math.random() - 0.5) * 10,
                y: gridHeight / 2 + (Math.random() - 0.5) * 10,
                color: cfg.color,
                radius: cfg.radius,
                speed: cfg.speed,
                health: cfg.health * (1 + this.wave / 10)
            });

            this.enemies.push(enemy);
            this.enemyCreatedCount++;
            this.lastCreatedEnemyTime = new Date();
        }

        // 对每一个enemy进行step操作，并绘制
        this.enemies.forEach((enemy, index) => {
            enemy.step({ path: this.pathCoord });
            enemy.draw();

            if (enemy.dead) {
                if (enemy.reachDest) {
                    this.life -= enemy.damage;
                }
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
            tower.draw(ctx);
        });

        // 如何确定游戏结束?
        if (this.enemyCreatedCount > 0  && this.enemies.length === 0) {
            setTimeout(() => {
                this.status = 'gameOver';
            }, 1000);
        }

        // 确定 bullet tower 的目标
        for (let i = 0, len = this.towers.length; i < len; i++) {
            const tower = this.towers[i];
            tower.findTarget(this.enemies);
            if (tower.target !== null) {
                const target = tower.target;
                // 调整其朝向
                tower.directionVec = vec2.fromValues(
                    target.x - tower.x,
                    target.y - tower.y
                );

                tower.direction = Math.atan2(target.y - tower.y,
                    target.x - tower.x) * (180 / Math.PI);
            }
        }


        // 检查bullet是否与enemy相撞
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
                        this.coordY * gridHeight + gridHeight / 2,
                        this.addTowerType
                    );
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
                    distance = calcuteDistance(this.bullets[i].x, this.bullets[i].y, this.enemies[j].x, this.enemies[j].y);
                }

                if (distance <= this.enemies[j].radius + 2) {
                    impact = true;
                    this.enemies[j].health -= this.bullets[i].damage;
                    if (this.enemies[j].health <= 0) {
                        this.money += this.enemies[j].value;
                        this.enemies.remove(j); j--;
                        this.score += 100;
                    }
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

        const cost = towerCost.baseTower;
        // 检查是否有足够金钱
        if (this.money - cost < 0) {
            console.log('You do not have enough money.');
            return -1;
        }

        const x = coordX * gridWidth + gridWidth / 2;
        const y = coordY * gridWidth + gridWidth / 2;

        let tower = null;
        switch (towerType) {
            case 'BASE':
                tower = new BaseTower({ ctx, x, y, bullets: this.bullets });
                break;
            case 'BULLET':
                tower = new BulletTower({ ctx, x, y, bullets: this.bullets });
                break;
            case 'LASER':
                tower = new LaserTower({ ctx, x, y, bullets: this.bullets });
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

    // 准备放置塔时，在鼠标所在位置画一个虚拟的塔
    drawGhostTower(ctx, x, y, towerType) {
        let tower = null;
        switch(towerType) {
            case 'BASE':
                tower = new BaseTower({ ctx, x, y, bullets: this.bullets, selected: true });
                break;
            case 'BULLET':
                tower = new BulletTower({ ctx, x, y, bullets: this.bullets, selected: true });
                break;
            case 'LASER':
                tower = new LaserTower({ ctx, x, y, bullets: this.bullets, selected: true });
                break;

            default:
                tower = null;
        }
        tower.draw(ctx);
    }


    displayInfo() {
        // 画面信息的显示
        if (document.getElementById('enemyCount')) {
            document.getElementById('enemyCount').innerHTML = `Enemy Count: ${this.enemies.length}, Bullets: ${this.bullets.length}`;
        }
    }

    bindEvent() {
        const element = this.element;
        // console.log(element);
    }

    generateWave() {
        this.waves.push(new Wave());
        this.wave++;
    }
}