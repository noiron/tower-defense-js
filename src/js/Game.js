import { vec2 } from 'gl-matrix';
import TowerFactory from './Entity/tower';
import Enemy from './Entity/Enemy';
import Map from './Entity/Map';
import Wave from './Wave';
import Message from './Entity/Message';
import { calculateDistance, index2Px, px2Index } from './utils';
import {
  gridNumX,
  gridNumY,
  WIDTH,
  HEIGHT,
  GAME_CONTROL_WIDTH,
  towerData,
  FRAMERATE,
  OFFSET_X,
  OFFSET_Y,
  GRID_SIZE,
} from './constants';
import globalId from './id';
import GameControl from './Entity/GameControl';
import GameInfo from './Entity/GameInfo';
import GameError from './Entity/GameError';
import { orbit, cfgPlayAudio } from './utils/config';
import { world } from '../index';
import EntityCollection from './EntityCollection';
import { beepAudio } from './audio';

const BORDER_WIDTH = 6;

const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');

const backgroundCanvas = document.getElementById('background');
const bgCtx = backgroundCanvas.getContext('2d');
backgroundCanvas.width = WIDTH + GAME_CONTROL_WIDTH;
backgroundCanvas.height = HEIGHT;

const gameControlCanvas = document.getElementById('game-control');
const panels = document.getElementById('panels');
const startButton = document.getElementById('start-button');
const backButton = document.getElementById('back-button');
const $chooseStage = document.getElementById('choose-stage');

const gameInfoCanvas = document.getElementById('game-info');
const status = document.getElementById('status');

export default class Game {
  constructor(opt) {
    // Init
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    this.element = opt.element;
    this.ctx = ctx;
    this.stage = opt.stage;

    this.init();
    this.bindEvent();
  }

  init() {
    this.initData();

    startButton.addEventListener(
      'click',
      this.startButtonClickHandler.bind(this),
      false
    );
    backButton.addEventListener(
      'click',
      this.backButtonClickHandler.bind(this),
      false
    );

    this.renderBackground();

    panels.style.display = 'block';

    const gameControlEle = document.getElementById('game-control');
    const gameControl = new GameControl({
      element: gameControlEle,
      game: this,
    });
    this.gameControl = gameControl;
    gameControl.draw();

    const $gameInfo = document.getElementById('game-info');
    const gameInfo = new GameInfo({
      element: $gameInfo,
      game: this,
    });
    this.gameInfo = gameInfo;
    gameInfo.draw();

    const $gameError = document.getElementById('error-message');
    const gameError = new GameError({
      element: $gameError,
      game: this,
    });
    this.gameError = gameError;
    gameError.draw();
  }

  initData() {
    this.genId = 0;
    globalId.clear();

    this.bullets = new EntityCollection();
    this.towers = new EntityCollection();
    this.enemies = new EntityCollection();

    this.money = 5000;
    this.col = 0;
    this.row = 0;
    this.enemyCreatedCount = 0; // 目前已经创建的enemy的总数
    this.lastCreatedEnemyTime = new Date();

    this.orbit = orbit[this.stage];

    const newTowerCoord = [5, 3];
    this.map = new Map({
      ctx,
      WIDTH,
      HEIGHT,
      newTowerCoord,
      orbit: this.orbit,
      game: this,
    });

    // 放置一个初始状态下的塔
    const tower = new TowerFactory['BASE']({
      id: globalId.genId(),
      ctx,
      x: GRID_SIZE / 2 + newTowerCoord[0] * GRID_SIZE + OFFSET_X,
      y: GRID_SIZE / 2 + newTowerCoord[1] * GRID_SIZE + OFFSET_Y,
      bullets: this.bullets,
    });
    this.towers.push(tower);

    this.mode = '';
    this.addTowerType = 'BASE';
    this.status = '';
    this.score = 0;
    this.life = 1000;

    // 当前是否选中塔
    this.towerSelect = false;
    this.towerSelectIndex = -1;
    this.towerSelectId = -1;

    this.wave = -1; // 当前第几波
    this.waves = [];

    // FPS 相关数据
    this.frames = 0;
    this.timeLastSecond = new Date().getTime();
    this.fps = 0;
    this.fpsRate = 0;
    this.time = 0;

    this.destory = false;
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
      status.style.display = 'block';
      this.initData();
      this.status = 'running';
      this.draw();
      this.gameControl.draw();
    }

    // 游戏开始时间
    this.time = new Date().getTime();
  }

  backButtonClickHandler(e) {
    e.stopPropagation();

    this.gameControl.stopAnim();
    $chooseStage.style.display = 'block';
    const panels = document.getElementById('panels');
    panels.style.display = 'none';
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    const gameControl = this.gameControl;
    gameControl.ctx.clearRect(
      0,
      0,
      gameControl.element.width,
      gameControl.element.height
    );

    this.destory = true;
    cancelAnimationFrame(this.animId);
    this.status = '';
  }

  draw() {
    // 游戏尚未开始的状态
    if (this.status === '') {
      return;
    }

    // FIXME: 选择不同的 stage 之后，之前的游戏画面会出现干扰
    if (this.stage !== world.stage || this.destory) {
      return;
    }

    // 游戏结束
    if (this.status === 'gameOver') {
      cancelAnimationFrame(this.animId); // NOT work !?
      return;
    }

    // 游戏暂停状态
    if (this.status === 'pause') {
      return;
    }

    this.calculateFPS();

    this.map.draw({
      towers: this.towers,
      towerSelect: this.towerSelect,
      towerSelectIndex: this.towerSelectIndex,
    });

    // TODO: 完成设定波数后，游戏也会结束
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
      const basePos = this.orbit[0];
      const enemy = new Enemy({
        id: globalId.genId(),
        ctx: ctx,
        x:
          GRID_SIZE / 2 +
          (Math.random() - 0.5) * 10 +
          basePos[0] * GRID_SIZE +
          OFFSET_X,
        y:
          GRID_SIZE / 2 +
          (Math.random() - 0.5) * 10 +
          basePos[1] * GRID_SIZE +
          OFFSET_Y,
        color: cfg.color,
        radius: cfg.radius,
        speed: cfg.speed,
        health: cfg.health * (1 + this.wave / 5),
        path: this.map.orbit,
      });

      this.enemies.push(enemy);
      this.enemyCreatedCount++;
      this.lastCreatedEnemyTime = new Date();
    }

    // 对每一个enemy进行step操作，并绘制
    this.enemies.forEach((enemy) => {
      enemy.step({ path: this.map.orbit });
      enemy.draw();

      if (enemy.dead) {
        if (enemy.reachDest) {
          this.life -= enemy.damage;
        }
        this.enemies.removeElementById(enemy.id);
        cfgPlayAudio && beepAudio.play();
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

    // 确定 tower 的目标
    this.towers.forEach((tower) => {
      tower.findTarget(this.enemies);
      if (tower.target !== null) {
        const target = tower.target;
        // 调整其朝向
        tower.directionVec = vec2.fromValues(
          target.x - tower.x,
          target.y - tower.y
        );

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
            this.bullets.removeElementByIndex(i--);
          } else {
            bullet.draw(ctx, this.enemies);
          }
          break;
        }
        case 'laser': {
          // 如果 bullet 的目标和其 parent 的目标不一致时，则删除这个 bullet
          if (
            !bullet.parent.target ||
            bullet.parent.target.id !== bullet.target.id
          ) {
            this.bullets.removeElementByIndex(i--);
            bullet.parent.shooting = false;
          } else {
            bullet.draw(ctx, this.enemies);
          }
          break;
        }
        case 'slow':
        case 'fire': {
          if (bullet.life <= 0) {
            this.bullets.removeElementByIndex(i--);
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
            index2Px(this.col, this.row).x,
            index2Px(this.col, this.row).y,
            this.addTowerType
          );
        }
      }
    }

    this.animId = requestAnimationFrame(() => this.draw());
  }

  // 循环检测 bullet 是否和 enemy 碰撞
  detectImpact() {
    for (var i = 0; i < this.bullets.length; i++) {
      let impact = false;
      let distance = 0;
      const bullet = this.bullets[i];

      for (var j = 0; j < this.enemies.length; j++) {
        const enemy = this.enemies[j];

        // 计算 bullet 和 enemy 距离
        distance = distBulletToEnemy(bullet, enemy);

        // enemy进入bullet的作用范围后，依据其种类产生效果
        switch (bullet.type) {
          case 'circle':
          case 'laser':
            if (distance <= enemy.radius + 2) {
              impact = true;
              enemy.health -= bullet.damage;
              if (enemy.health <= 0) {
                this.money += enemy.value;
                this.enemies.removeElementByIndex(j--);
                cfgPlayAudio && beepAudio.play();

                this.score += 100;
              }
              break;
            }
            break;

          case 'slow':
            if (distance <= bullet.range) {
              if (enemy.buff.every((b) => b.source !== bullet.id)) {
                enemy.buff.push({
                  type: 'deceleration',
                  value: 0.35,
                  source: bullet.id,
                  duration: 10,
                });
              }
            }
            break;

          case 'fire':
            if (distance <= bullet.range) {
              enemy.health -= bullet.damage;
              if (enemy.health <= 0) {
                this.money += enemy.value;
                this.enemies.removeElementByIndex(j--);
                this.score += 100;
              }
            }
            break;
        }
      }

      if (['laser', 'slow', 'fire'].includes(bullet.type)) {
        impact = false;
      }
      if (impact) {
        this.bullets.removeElementByIndex(i--);
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
      this.showError('You do not have enough money.');
      return -1;
    }

    const { x, y } = index2Px(col, row);
    const id = globalId.genId();

    const config = { id, ctx, x, y, bullets: this.bullets };

    let tower = new TowerFactory[towerType](config);

    if (!this.map.checkPath(col, row)) {
      const info = '存在不能到达的区域，不能放置在这里';
      this.showError(info);
      return;
    }

    if (tower.type === 'BLOCK') {
      this.map.coord[col][row] = 'B';
    } else {
      this.map.coord[col][row] = 'T';
    }
    this.map.findPath();
    // 重新计算当前 enemy 的路径
    this.enemies.forEach((enemy) => {
      const { col, row } = px2Index(enemy.x, enemy.y);
      enemy.path = this.map.findPointPath([col, row]);
      enemy.wp = 1;

      // 当前位置到目标点的距离
      enemy.dx = 0;
      enemy.dy = 0;
      enemy.dist = 0;

      // 标记是否需要转弯
      enemy.angleFlag = 1;
    });

    this.money -= cost;
    this.towers.push(tower);
  }

  sellTower(index = this.towerSelectIndex) {
    const tower = this.towers[index];
    const { col, row, type: towerType = 'BASE' } = tower;

    // 删除 laser tower 时将其对应的 laser 一起删除
    if (towerType === 'LASER') {
      for (let i = 0; i < this.bullets.length; i++) {
        const bullet = this.bullets[i];
        if (bullet.type === 'laser' && bullet.parent.id === tower.id) {
          this.bullets.removeElementByIndex(i--);
        }
      }
    }

    this.towers.removeElementByIndex(index);
    this.map.coord[col][row] = '';

    // 出售价格改为购买价格的 50%
    this.money += towerData[towerType].cost * 0.5;
    this.towerSelect = false;
    this.towerSelectIndex = -1;
  }

  upgradeTower(index = this.towerSelectIndex) {
    const tower = this.towers[index];
    if (tower.level < 4) {
      // TODO: 对塔的升级应该按预设数值，或按比例
      // TODO: 将塔的升级方法写入塔自身的 class 中去
      tower.range *= 1.25;
      tower.damage *= 1.5;
      tower.level++;
    } else {
      this.showError('已升级至最大值');
    }
  }

  // 准备放置塔时，在鼠标所在位置画一个虚拟的塔
  drawGhostTower(ctx, x, y, towerType) {
    const config = { ctx, x, y, bullets: this.bullets, selected: true };
    const tower = new TowerFactory[towerType](config);
    tower.draw(ctx);
  }

  bindEvent() {
    const canvas = this.element;
    const game = this;

    // 在canvas上进行右键操作
    canvas.oncontextmenu = function (e) {
      game.mode = '';
      e.preventDefault();
    };

    canvas.onclick = function (e) {
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const { col, row } = px2Index(x, y);
      // console.log(col, row);

      /* 只在地图范围内进行操作 */
      if (0 <= col && col < gridNumX && 0 <= row && row < gridNumY) {
        if (game.map.coord[col][row] === 'T') {
          // 点击的格子内为塔
          game.towers.map((tower, index) => {
            if (tower.col === col && tower.row === row) {
              console.log(`You select ${index}th tower, its id is ${tower.id}`);
              // 已经选中的塔再次点击则取消
              if (game.towerSelectIndex === index) {
                game.towerSelectIndex = -1;
                game.towerSelectId = -1;
                game.towerSelect = false;
                // game.map.selectCoord = null;
              } else {
                game.towerSelectIndex = index;
                game.towerSelectId = tower.id;
                game.towerSelect = true;
                // game.map.selectCoord = { col, row };
              }
            }
          });
        } else {
          game.towerSelect = false;
          game.towerSelectId = -1;
          game.towerSelectIndex = -1;
          // game.map.selectCoord = { col, row };
        }

        if (game.mode === 'ADD_TOWER') {
          game.createNewTower(col, row, game.addTowerType);
        }
      }
    };

    canvas.onmousemove = function (e) {
      if (game.mode === 'ADD_TOWER') {
        game.cursorX = e.pageX;
        game.cursorY = e.pageY;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const { col, row } = px2Index(x, y);
        game.col = col;
        game.row = row;
      }
    };
  }

  shouldGenerateEnemy() {
    return this.wave < 999 && new Date() - this.lastCreatedEnemyTime > 1000;
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
    cancelAnimationFrame(this.animId);
  }

  calculateFPS() {
    // 当前帧的时间
    const frameTime = new Date().getTime();
    this.frames++;

    // 距离上次更新 FPS 已经过去了一秒
    if (frameTime > this.timeLastSecond + 1000) {
      this.fps = Math.min(
        Math.round((this.frames * 1000) / (frameTime - this.timeLastSecond)),
        FRAMERATE
      );

      this.timeLastSecond = frameTime;
      this.frames = 0;
    }

    const fps = Math.round(this.fps);
    const time =
      Math.round(((new Date().getTime() - this.time) / 1000) * 100) / 100; // 显示时间保留两位小数
    const fpsRate = Math.round(Math.min(this.fps / FRAMERATE, 1) * 100);

    let statusText = `Time: <span>${time}</span>`;
    statusText += `<p class="fps">FPS: <span>${fps} (${fpsRate}%)</span></p>`;

    status.innerHTML = statusText;
  }

  showError(info) {
    const message = new Message({ text: info });
    console.log(info);
    this.gameError.messages.push(message);
  }
}

function bulletOutOfBound(bullet) {
  switch (bullet.type) {
    case 'circle':
      return (
        bullet.x < 0 || bullet.y < 0 || bullet.x > WIDTH || bullet.y > HEIGHT
      );

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

// 计算不同种类的 bullet 和 enemy 的距离
function distBulletToEnemy(bullet, enemy) {
  let dist;

  switch (bullet.type) {
    case 'circle':
    case 'slow':
    case 'fire':
      dist = calculateDistance(bullet.x, bullet.y, enemy.x, enemy.y);
      break;
    case 'laser':
      if (bullet.target.id === enemy.id) {
        dist = 0;
      }
      break;
  }
  return dist;
}
