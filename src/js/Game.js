import { vec2 } from 'gl-matrix';
import Path from './Entity/Path.js';
import { gameControl } from './../index';
import TowerFactory from './Entity/tower';
import Enemy from './Entity/Enemy';
import Map from './Entity/Map';
import Wave from './Wave';
import { calcuteDistance } from './utils/utils';
import {
    gridWidth,
    gridHeight,
    gridNumX,
    gridNumY,
    WIDTH,
    HEIGHT,
    GAME_CONTROL_WIDTH,
    towerData
} from './utils/constant';
import globalId from './id';

const BORDER_WIDTH = 6;

const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');

const gameOverEle = document.getElementById('game-over');

const backgroundCanvas = document.getElementById('background');
const bgCtx = backgroundCanvas.getContext('2d');
backgroundCanvas.width = WIDTH + GAME_CONTROL_WIDTH;
backgroundCanvas.height = HEIGHT;

const gameControlCanvas = document.getElementById('game-control');
const panels = document.getElementById('panels');
const startButton = document.getElementById('start-button');

const gameInfoCanvas = document.getElementById('game-info');

export default class Game {
    constructor(opt) {
        // Init
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        this.element = opt.element;
        this.ctx = ctx;

        this.init();
        this.draw();
        this.bindEvent();
    }

    init() {
        this.initData();

        window.addEventListener('resize', this.windowResizeHandler, false);
        startButton.addEventListener('click', this.startButtonClickHandler.bind(this), false);

        this.windowResizeHandler();
        this.renderBackground();
    }

    initData() {
        this.genId = 0;
        globalId.clear();

        this.bullets = [];
        this.towers = [];
        this.enemies = [];

        this.money = 5000;
        this.col = 0;
        this.row = 0;
        this.enemyCreatedCount = 0; // 目前已经创建的enemy的总数
        this.lastCreatedEnemyTime = new Date();

        this.pathCoord = [
            [0, 0],
            [18, 0],
            [18, 4],
            [8, 4],
            [8, 10],
            [16, 10],
            [16, 14],
            [-1, 14]
        ];

        const newTowerCoord = [8, 3];
        this.map = new Map({ ctx, WIDTH, HEIGHT, newTowerCoord, pathCoord: this.pathCoord });

        // 放置一个初始状态下的塔
        const tower = new TowerFactory['BASE']({
            id: globalId.genId(),
            ctx,
            x: gridWidth / 2 + newTowerCoord[0] * gridWidth,
            y: gridHeight / 2 + newTowerCoord[1] * gridHeight,
            bullets: this.bullets
        });
        this.towers.push(tower);

        this.mode = '';
        this.addTowerType = 'BASE';
        this.status = '';
        this.score = 0;
        this.life = 1000000;

        // 当前是否选中塔
        this.towerSelect = false;
        this.towerSelectIndex = -1;
        this.towerSelectId = -1;

        this.wave = -1; // 当前第几波
        this.waves = [];
    }

    windowResizeHandler() {
        // 确定canvas的位置
        const cvx = (window.innerWidth - WIDTH - GAME_CONTROL_WIDTH) * 0.5;
        const cvy = (window.innerHeight - HEIGHT) * 0.5;

        canvas.style.position = 'absolute';
        canvas.style.left = cvx + 'px';
        canvas.style.top = cvy + 'px';

        backgroundCanvas.style.position = 'absolute';
        backgroundCanvas.style.left = cvx + BORDER_WIDTH + 'px';
        backgroundCanvas.style.top = cvy + BORDER_WIDTH + 'px';

        gameControlCanvas.style.position = 'absolute';
        gameControlCanvas.style.left = cvx + WIDTH + BORDER_WIDTH + 'px';
        gameControlCanvas.style.top = cvy + 'px';

        panels.style.position = 'absolute';
        panels.style.left = cvx + BORDER_WIDTH + 'px';
        panels.style.top = cvy + 200 + 'px';

        gameInfoCanvas.style.position = 'absolute';
        gameInfoCanvas.style.left = cvx + BORDER_WIDTH + 'px';
        gameInfoCanvas.style.top = cvy + BORDER_WIDTH + 'px';
    }

    renderBackground() {
        const gradient = bgCtx.createRadialGradient(
            (WIDTH + GAME_CONTROL_WIDTH) * 0.5,
            HEIGHT * 0.5,
            0,
            (WIDTH + GAME_CONTROL_WIDTH) * 0.5,
            HEIGHT * 0.5,
            500
        );

        gradient.addColorStop(0, 'rgba(0, 70, 70, 1)');
        gradient.addColorStop(1, 'rgba(0, 8, 14, 1');

        bgCtx.fillStyle = gradient;
        ctx.fillStyle = gradient;

        bgCtx.fillRect(0, 0, WIDTH + GAME_CONTROL_WIDTH, HEIGHT);
    }

    startButtonClickHandler(e) {
        e.stopPropagation();

        if (this.status === '' || this.status === 'gameOver') {
            panels.style.display = 'none';
            this.initData();
            this.status = 'running';
            this.draw();
            gameControl.draw();
        }
    }

    draw() {
        // 游戏尚未开始的状态
        if (this.status === '') {
            return;
        }

        // 游戏结束
        if (this.status === 'gameOver') {
            // gameOverEle.style.display = 'block';
            return;
        }

        // 游戏暂停状态
        if (this.status === 'pause') {
            return;
        }

        this.map.draw({
            towers: this.towers,
            towerSelect: this.towerSelect,
            towerSelectIndex: this.towerSelectIndex
        });

        if (this.life <= 0) {
            this.gameOver();
        }

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
                health: cfg.health * (1 + this.wave / 40)
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

        // // 确定游戏是否结束
        // if (this.enemyCreatedCount > 0 && this.enemies.length === 0) {
        //     setTimeout(() => {
        //         this.status = 'gameOver';
        //     }, 1000);
        // }

        // 确定 tower 的目标
        this.towers.forEach(tower => {
            tower.findTarget(this.enemies);
            if (tower.target !== null) {
                const target = tower.target;
                // 调整其朝向
                tower.directionVec = vec2.fromValues(target.x - tower.x, target.y - tower.y);

                tower.direction =
                    Math.atan2(target.y - tower.y, target.x - tower.x) * (180 / Math.PI);
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
                case 'slow': 
                case 'fire': {
                    if (bullet.life <= 0) {
                        this.bullets.remove(i--);
                        bullet.parent.shooting = false;
                    } else {
                        bullet.parent.shooting = true;
                        bullet.draw(ctx);
                    }
                    break;
                }
                default:
                    bullet.draw(ctx);
            }
        }

        if (this.mode === 'ADD_TOWER') {
            // 添加塔模式
            if (
                0 <= this.col &&
                this.col < gridNumX &&
                0 <= this.row &&
                this.row < gridNumY
            ) {
                if (this.map.coord[this.col][this.row] !== 'T') {
                    // 该位置没有塔
                    this.drawGhostTower(
                        ctx,
                        this.col * gridWidth + gridWidth / 2,
                        this.row * gridHeight + gridHeight / 2,
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

                // 计算 bullet 和 enemy 距离
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
                } else if (bullet.type === 'circle' || bullet.type === 'slow' || bullet.type === 'fire') {
                    distance = calcuteDistance(bullet.x, bullet.y, enemy.x, enemy.y);
                }
                if (bullet.type === 'laser') {
                    if (bullet.target.id === enemy.id) {
                        distance = 0;
                    }
                }

                // enemy进入bullet的作用范围后，依据其种类产生效果
                if (bullet.type === 'circle' || bullet.type === 'laser') {
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
                } else if (bullet.type === 'slow') {
                    if (distance <= bullet.range) {
                        if (enemy.buff.every(b => b.source !== bullet.id)) {
                            enemy.buff.push({
                                type: 'deceleration',
                                value: 0.35,
                                source: bullet.id,
                                duration: 10
                            });
                        }
                    }
                } else if (bullet.type === 'fire') {
                    if (distance <= bullet.range) {
                        enemy.health -= bullet.damage;
                        if (enemy.health <= 0) {
                            this.money += enemy.value;
                            this.enemies.remove(j--);
                            this.score += 100;
                        }
                    }
                }
            }
            if (bullet.type === 'laser' || bullet.type === 'slow' || bullet.type === 'fire') {
                impact = false;
            }
            if (impact) {
                this.bullets.remove(i--);
            }
        }
    }

    /**
     * 创建一个新的tower
     * @param {Number} col x轴的坐标  
     * @param {Number} row y轴的坐标
     */
    createNewTower(col, row, towerType) {
        // 检查当前位置是否已有物体
        if (this.map.coord[col][row] === 'T') {
            console.log('You can not place tower here!');
            return -1;
        }
        const cost = towerData[towerType].cost;
        // 检查是否有足够金钱
        if (this.money - cost < 0) {
            // TODO: 将提示信息显示在画面中
            console.log('You do not have enough money.');
            return -1;
        }

        const x = col * gridWidth + gridWidth / 2;
        const y = row * gridWidth + gridWidth / 2;
        const id = globalId.genId();

        const config = { id, ctx, x, y, bullets: this.bullets };

        let tower = new TowerFactory[towerType](config);

        this.map.coord[col][row] = 'T';
        this.money -= cost;
        this.towers.push(tower);
    }

    sellTower(index = this.towerSelectIndex) {
        const tower = this.towers[index];
        const { col, row, type: towerType = 'BASE' } = tower;
        this.towers.remove(index);
        console.log(index);
        this.map.coord[col][row] = '';

        // 出售价格改为购买价格的 50%
        this.money += (towerData[towerType].cost * 0.5);
        this.towerSelect = false;
        this.towerSelectIndex = -1;
    }

    upgradeTower(index = this.towerSelectIndex) {
        const tower = this.towers[index];
        // TODO: 已升级至最大值后，需提示玩家
        if (tower.level < 4) {
            // TODO: 对塔的升级应该按预设数值，或按比例
            tower.range *= 1.5;
            tower.damage *= 1.5;
            tower.level++;
        }
    }

    // 准备放置塔时，在鼠标所在位置画一个虚拟的塔
    drawGhostTower(ctx, x, y, towerType) {
        const config = { ctx, x, y, bullets: this.bullets, selected: true };
        const tower = new TowerFactory[towerType](config);
        tower.draw(ctx);
    }

    displayInfo() {
        // 画面信息的显示
        const enemyCountElement = document.getElementById('enemyCount');
        if (enemyCountElement) {
            enemyCountElement.innerHTML = `Enemy Count: ${this.enemies.length}, Bullets: ${this
                .bullets.length}`;
        }
    }

    bindEvent() {
        const element = this.element;
    }

    shouldGenerateEnemy() {
        return this.wave < 999 && new Date() - this.lastCreatedEnemyTime > 500;
    }

    shouldGenerateWave() {
        return this.waves.length === 0 || this.waves[this.wave].waveFinish();
    }

    generateWave() {
        this.waves.push(new Wave());
        this.wave++;
    }

    gameOver() {
        const title = document.getElementById('title');
        title.innerHTML = `得分：${this.score}`;
        panels.style.display = 'block';
        this.status = 'gameOver';
    }
}

function bulletOutOfBound(bullet) {
    switch (bullet.type) {
        case 'circle':
            return bullet.x < 0 || bullet.y < 0 || bullet.x > WIDTH || bullet.y > HEIGHT;

        case 'line':
            return (
                bullet.start[0] < 0 ||
                bullet.start[1] < 0 ||
                bullet.start[0] > WIDTH ||
                bullet.start[1] > HEIGHT
            );

        default:
            return false;
    }
}
