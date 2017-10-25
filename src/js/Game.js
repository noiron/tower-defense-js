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
            id: globalId.genId(),
            ctx,
            x: gridWidth / 2 + newTowerCoord[0] * gridWidth,
            y: gridHeight / 2 + newTowerCoord[1] * gridHeight,
            bullets: this.bullets,
        });
        this.towers.push(tower);

        this.mode = '';
        this.addTowerType = 'BASE';
        this.status = 'running';
        this.score = 0;
        this.life = 100;

        // 当前是否选中塔
        this.towerSelect = false;
        this.towerSelectIndex = -1;
        this.towerSelectId = -1;

        this.wave = -1;  // 当前第几波
        this.waves = [];

        this.draw();
        this.bindEvent();
    }

    // Specify what to draw
    draw() {
        if (this.status === 'gameOver') {
            gameOverEle.style.display = 'block';
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

        if (this.shouldGenerateWave()) {
            this.generateWave();
        }

        // 生成enemy
        // 总数小于50，且间隔 x ms以上
        if (this.shouldGenerateEnemy()) {
            const cfg = this.waves[this.wave].generateEnemy();
            const enemy = new Enemy({
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
                // TODO: 此处利用 id 进行删除
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

        // 确定游戏是否结束
        if (this.enemyCreatedCount > 0  && this.enemies.length === 0) {
            setTimeout(() => {
                this.status = 'gameOver';
            }, 1000);
        }

        // 确定 tower 的目标
        this.towers.forEach(tower => {
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
        });


        // 检查bullet是否与enemy相撞
        this.detectImpact();

        // 移除出界的bullet，画出剩下的bullet
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            
            switch (bullet.type) {
                case 'line':
                case 'circle': {
                    if (bulletOutOfBound(bullet)) {
                        this.bullets.remove(i--);
                    } else {
                        bullet.draw(ctx, this.enemies);
                    }
                    break;
                }
                case 'laser': {
                    // 如果 bullet 的目标和其 parent 的目标不一致时，则删除这个 bullet
                    if (!bullet.parent.target || bullet.parent.target.id !== bullet.target.id) {
                        this.bullets.remove(i--);
                        bullet.parent.shooting = false;
                    } else {
                        bullet.draw(ctx, this.enemies);
                    }
                    break;
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
            const bullet = this.bullets[i];

            for (var j = 0; j < this.enemies.length; j++) {
                const enemy = this.enemies[j];

                if (bullet.type === 'line') {
                    // 求圆心至bullet的垂足
                    let normal = vec2.create();
                    let bVec = bullet.directionVec;
                    let aDotB = 1;

                    let aVec = vec2.fromValues(
                        enemy.x - bullet.start[0],
                        enemy.y - bullet.start[1]
                    );
                    vec2.multiply(aDotB, aVec, bVec);
                    vec2.scale(bVec, bVec, aDotB);
                    vec2.add(normal, bullet.start, bVec);

                    distance = calcuteDistance(normal[0], normal[1], enemy.x, enemy.y);
                } else if (bullet.type === 'circle') {
                    distance = calcuteDistance(bullet.x, bullet.y, enemy.x, enemy.y);
                } 
                
                if (bullet.type === 'laser') {
                    if (bullet.target.id === enemy.id) {
                        distance = 0;
                    }
                }

                if (distance <= enemy.radius + 2) {
                    impact = true;
                    enemy.health -= bullet.damage;
                    if (enemy.health <= 0) {
                        this.money += enemy.value;
                        this.enemies.remove(j--);
                        this.score += 100;
                    }
                    break;
                }
            }
            if (bullet.type === 'laser') {
                impact = false;
            }
            if (impact) {
                this.bullets.remove(i--);
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
        const id = globalId.genId();

        const config = { id, ctx, x, y, bullets: this.bullets };

        let tower = null;
        switch (towerType) {
            case 'BASE':
                tower = new BaseTower(config);
                break;
            case 'BULLET':
                tower = new BulletTower(config);
                break;
            case 'LASER':
                tower = new LaserTower(config);
                break;
            default:
                tower = new BulletTower(config);
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
        const config = { ctx, x, y, bullets: this.bullets, selected: true };

        switch(towerType) {
            case 'BASE':
                tower = new BaseTower(config);
                break;
            case 'BULLET':
                tower = new BulletTower(config);
                break;
            case 'LASER':
                tower = new LaserTower(config);
                break;

            default:
                tower = null;
        }
        tower.draw(ctx);
    }


    displayInfo() {
        // 画面信息的显示
        const enemyCountElement = document.getElementById('enemyCount');
        if (enemyCountElement) {
            enemyCountElement.innerHTML = 
                `Enemy Count: ${this.enemies.length}, Bullets: ${this.bullets.length}`;
        }
    }

    bindEvent() {
        const element = this.element;
    }

    shouldGenerateEnemy() {
        return this.wave < 100 && new Date() - this.lastCreatedEnemyTime > 500;
    }

    shouldGenerateWave() {
        return this.waves.length === 0 || this.waves[this.wave].waveFinish();
    }

    generateWave() {
        this.waves.push(new Wave());
        this.wave++;
    }
}

function bulletOutOfBound(bullet) {
    switch (bullet.type) {
        case 'circle':
            return (bullet.x < 0 || bullet.y < 0 ||
                bullet.x > WIDTH || bullet.y > HEIGHT);

        case 'line':
            return (bullet.start[0] < 0 || bullet.start[1] < 0 ||
            bullet.start[0] > WIDTH || bullet.start[1] > HEIGHT);

        default:
            return false;
    }
}