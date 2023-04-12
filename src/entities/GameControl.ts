import { LaserTower, SlowTower, FireTower, Block, BulletTower } from './towers';
import { isInside, highlightGrid, drawGrid } from '../utils';
import {
  GAME_CONTROL_WIDTH,
  GAME_CONTROL_HEIGHT,
  towerData,
} from '@/constants';
import Game from '@/Game';
import i18next from 'i18next';

const GRID_WIDTH = 60;
const GRID_HEIGHT = 60;
const GRID_NUM_X = 3;
const GRID_NUM_Y = 2;
const WIDTH = GAME_CONTROL_WIDTH; // 230
const HEIGHT = GAME_CONTROL_HEIGHT; // 640

const FILL_COLOR = '#fafafa';
const DISABLE_COLOR = '#aaa';
const HOVER_COLOR = 'red';

// 每一个子数组代表一列
const TOWER_TYPE = [['BULLET', 'FIRE'], ['LASER'], ['SLOW', 'BLOCK']];

interface Option {
  element: HTMLCanvasElement;
  game: Game;
}

interface GameControl extends Option {
  option: Option & {
    offsetX: number;
    offsetY: number;
  };
  ctx: CanvasRenderingContext2D;
  towerAreaRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  pauseBtn: any;
  upgradeBtn: any;
  sellBtn: any;
  towerArea: TowerArea;
  animId: number;
  offsetX: number;
  offsetY: number;
}

class GameControl implements Option {
  constructor(opt: Option) {
    this.option = Object.assign(
      {
        offsetX: 25,
        offsetY: 25,
      },
      opt
    );

    const element = this.option.element;
    this.game = opt.game;

    element.width = WIDTH;
    element.height = HEIGHT;
    this.element = element;

    this.ctx = element.getContext('2d');
    this.offsetX = this.option.offsetX;
    this.offsetY = this.option.offsetY;

    this.towerAreaRect = {
      x: this.offsetX,
      y: this.offsetY,
      width: GRID_NUM_X * GRID_WIDTH,
      height: GRID_NUM_Y * GRID_HEIGHT,
    };

    const commonBtnProp = {
      x: this.offsetX,
      width: 100,
      height: 40,
      status: '',
    };

    this.pauseBtn = {
      y: 350,
      text: i18next.t('Pause'),
      ...commonBtnProp,
    };

    this.upgradeBtn = {
      y: 410,
      text: i18next.t('Upgrade'),
      disable: true,
      ...commonBtnProp,
    };

    this.sellBtn = {
      y: 470,
      text: i18next.t('Sell'),
      disable: true,
      ...commonBtnProp,
    };

    this.towerArea = new TowerArea({
      ctx: this.ctx,
      x: this.offsetX,
      y: this.offsetY,
    });

    this.bindEvent();
  }

  draw() {
    // 游戏未开始时，不绘制该区域
    if (this.game.status === '') {
      return;
    }

    const ctx = this.ctx;
    // ctx.fillStyle = '#eee';
    ctx.fillStyle = '#010c12';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.drawGrid();

    if (this.game.mode !== 'ADD_TOWER') {
      this.towerArea.selected = -1;
    }
    this.towerArea.draw();
    this.drawText();
    this.drawButton();
    this.drawSelectedTowerInfo();

    this.animId = requestAnimationFrame(() => this.draw());
  }

  // Not used?
  stopAnim() {
    cancelAnimationFrame(this.animId);
    const ctx = this.ctx;
    ctx.fillStyle = '#010c12';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(WIDTH, 0);
    ctx.lineTo(WIDTH, HEIGHT);
    ctx.lineTo(0, HEIGHT);
    ctx.closePath();
    ctx.stroke();
  }

  drawText() {
    const ctx = this.ctx;
    const game = this.game;
    ctx.fillStyle = FILL_COLOR;
    ctx.font = '20px Arial';
    ctx.fillText(`${i18next.t('Wave')}: ${game.wave + 1}`, this.offsetX, 200);
    ctx.fillText(`${i18next.t('Life')}: ${game.life}`, this.offsetX, 240);
    ctx.fillText(`${i18next.t('Score')}: ${game.score}`, this.offsetX, 280);
    ctx.fillText(`${i18next.t('Money')}: ${game.money}`, this.offsetX, 320);
  }

  drawButton() {
    const ctx = this.ctx;

    [this.sellBtn, this.upgradeBtn].forEach(
      (b) => (b.disable = !this.game.towerSelect)
    );
    [this.pauseBtn, this.sellBtn, this.upgradeBtn].forEach((btn) => {
      if (btn.disable) {
        /* 按钮当前处于不可用状态 */
        ctx.strokeStyle = DISABLE_COLOR;
        ctx.fillStyle = DISABLE_COLOR;
      } else if (btn.status === 'hover') {
        ctx.strokeStyle = HOVER_COLOR;
        ctx.fillStyle = HOVER_COLOR;
      } else {
        ctx.strokeStyle = FILL_COLOR;
        ctx.fillStyle = FILL_COLOR;
      }
      ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
      ctx.fillText(btn.text, btn.x + btn.width / 3.5, btn.y + btn.height / 1.6);
    });
  }

  drawSelectedTowerInfo() {
    const game = this.game;
    if (!game.towerSelect) {
      return;
    }
    const ctx = this.ctx;
    const tower = game.towers[game.towerSelectIndex];

    ctx.fillStyle = FILL_COLOR;
    ctx.font = '18px Arial';
    ctx.fillText(
      `${i18next.t('CurrentLevel')}: ${tower.level}`,
      this.offsetX,
      560
    );
    ctx.fillText(
      `${i18next.t('Attack')}: ${tower.damage.toFixed(2)}`,
      this.offsetX,
      585
    );
  }

  // 在游戏的控制区域绑定事件
  bindEvent() {
    const $element = $(this.option.element);
    const game = this.game;
    let x = 0;
    let y = 0;

    // 点击事件的绑定
    $element.click((e) => {
      const $canvas = $(e.target);
      const offset = $canvas.offset();
      x = e.clientX - offset.left;
      y = e.clientY - offset.top;

      // 检查点击位置是否在 tower area 内
      if (isInside({ x, y }, this.towerAreaRect)) {
        const xIdx = Math.floor((x - this.offsetX) / GRID_WIDTH);
        const yIdx = Math.floor((y - this.offsetY) / GRID_HEIGHT);

        if (TOWER_TYPE[xIdx][yIdx]) {
          if (
            game.mode === 'ADD_TOWER' &&
            game.addTowerType === TOWER_TYPE[xIdx][yIdx]
          ) {
            /* 添加塔模式下，点击同一种类的塔，则取消添加状态 */
            game.mode = '';
            game.addTowerType = '';
          } else {
            /* 进入添加塔模式，或切换塔的种类 */
            game.mode = 'ADD_TOWER';
            game.addTowerType = TOWER_TYPE[xIdx][yIdx];
            this.towerArea.selected = [xIdx, yIdx];
          }
        }
      } else {
        this.towerArea.selected = -1;
      }

      if (isInside({ x, y }, this.pauseBtn)) {
        this.pauseBtn.text =
          game.status === 'running' ? i18next.t('Resume') : i18next.t('Pause');
        game.status = game.status === 'running' ? 'pause' : 'running';
        if (game.status === 'running') {
          game.draw();
        }
      }

      if (isInside({ x, y }, this.sellBtn)) {
        if (game.towerSelect === true) {
          console.log('you sell a tower');
          game.sellTower();
        }
      }

      if (isInside({ x, y }, this.upgradeBtn)) {
        if (game.towerSelect === true) {
          game.upgradeTower();
        }
      }
    });

    // hover 事件的绑定
    $element.mousemove((e) => {
      // e.stopPropagation()
      const gameInfo = this.game.gameInfo;
      const pauseBtn = this.pauseBtn;
      const sellBtn = this.sellBtn;

      const $canvas = $(e.target);
      const offset = $canvas.offset();
      x = e.clientX - offset.left;
      y = e.clientY - offset.top;

      // 鼠标hover在暂停按钮上
      if (isInside({ x, y }, pauseBtn)) {
        pauseBtn.status = 'hover';
      } else {
        pauseBtn.status = '';
      }

      if (isInside({ x, y }, sellBtn)) {
        sellBtn.status = 'hover';
      } else {
        sellBtn.status = '';
      }

      // 鼠标 hover 在 tower 上时，显示相应提示信息
      if (isInside({ x, y }, this.towerAreaRect)) {
        const col = Math.floor((x - this.offsetX) / GRID_WIDTH);
        const row = Math.floor((y - this.offsetY) / GRID_HEIGHT);

        let infoX = this.offsetX + col * GRID_WIDTH - 100;

        const towerType = TOWER_TYPE[col][row];
        const text = [];
        if (towerType) {
          const data = towerData[towerType];
          const tower = this.towerArea.towers[towerType];
          text.push(data.info);
          text.push(`${i18next.t('Cost')}: ${data.cost}`);
          text.push(`${i18next.t('Attack')}: ${tower.damage}`);
        }
        // TODO: 修改此处，使其更通用
        if (row === 0 && col === 2) {
          infoX -= 120;
        } else if (row === 1 && col === 0) {
          infoX -= 50;
        }

        gameInfo.infos = [
          {
            x: infoX,
            y: this.offsetY + row * GRID_HEIGHT,
            width: 200,
            height: 50,
            text,
          },
        ];
      } else {
        gameInfo.infos = [];
      }
    });
  }
}

export default GameControl;

interface TowerAreaOption {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
}

interface TowerArea extends TowerAreaOption {
  selected: -1 | [number, number];
  offsetX: number;
  offsetY: number;
  towers: any;
}

class TowerArea implements TowerAreaOption {
  constructor(opt: TowerAreaOption) {
    this.ctx = opt.ctx;
    this.selected = -1;
    this.offsetX = opt.x;
    this.offsetY = opt.y;

    const bulletTower = new BulletTower({
      x: this.offsetX + GRID_WIDTH / 2 + 10,
      y: this.offsetY + GRID_HEIGHT / 2,
      ctx: this.ctx,
      radius: 12,
    });

    const laserTower = new LaserTower({
      x: this.offsetX + GRID_WIDTH * 1.5 + 5,
      y: this.offsetY + GRID_HEIGHT / 2,
      ctx: this.ctx,
      direction: 90,
      radius: 10,
    });

    const slowTower = new SlowTower({
      x: this.offsetX + GRID_WIDTH * 2.5 + 5,
      y: this.offsetY + GRID_HEIGHT / 2,
      ctx: this.ctx,
      radius: 12,
    });

    const fireTower = new FireTower({
      x: this.offsetX + GRID_WIDTH / 2 + 5,
      y: this.offsetY + GRID_HEIGHT * 1.5,
      ctx: this.ctx,
      radius: 10,
    });

    const block = new Block({
      x: this.offsetX + GRID_WIDTH * 2.5,
      y: this.offsetY + GRID_HEIGHT * 1.5,
      ctx: this.ctx,
      radius: 0,
    });

    this.towers = {
      BULLET: bulletTower,
      LASER: laserTower,
      SLOW: slowTower,
      FIRE: fireTower,
      BLOCK: block,
    };
  }

  draw() {
    const ctx = this.ctx;
    ctx.strokeStyle = FILL_COLOR;
    ctx.lineWidth = 1;

    drawGrid(
      ctx,
      GRID_NUM_X,
      GRID_NUM_Y,
      GRID_WIDTH,
      FILL_COLOR,
      this.offsetX,
      this.offsetY
    );

    if (this.selected !== -1) {
      this.highlightTower(this.selected[0], this.selected[1]);
    }

    Object.keys(this.towers).forEach((key) => {
      this.towers[key].draw(ctx);
    });
  }

  highlightTower(col: number, row: number) {
    const x = col * GRID_WIDTH + this.offsetX;
    const y = row * GRID_HEIGHT + this.offsetY;
    highlightGrid(this.ctx, x, y, GRID_WIDTH, GRID_HEIGHT);
  }
}
