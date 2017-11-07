import { BaseTower, LaserTower, SlowTower } from './tower';
import { isInside } from './../utils/utils';
import { GAME_CONTROL_WIDTH, GAME_CONTROL_HEIGHT } from '../utils/constant';
import { gameInfo } from './../../index';

const GRID_WIDTH = 60;
const GRID_HEIGHT = 60;
const GRID_NUM_X = 3;
const GRID_NUM_Y = 2;
const WIDTH = GAME_CONTROL_WIDTH;   // 230
const HEIGHT = GAME_CONTROL_HEIGHT; // 640

const FILL_COLOR = '#fafafa';

const gameInfoCanvas = document.getElementById('game-info');
const infoCtx = gameInfoCanvas.getContext('2d');

class GameControl {
    constructor(opt) {
        this.option = Object.assign(
            {
                offsetX: 25,
                offsetY: 25
            },
            opt
        );

        const element = this.option.element;
        this.game = opt.game;

        element.width = WIDTH;
        element.height = HEIGHT;

        this.ctx = element.getContext('2d');
        this.offsetX = this.option.offsetX;
        this.offsetY = this.option.offsetY;

        this.towerAreaRect = {
            x: this.offsetX,
            y: this.offsetY,
            width: GRID_NUM_X * GRID_WIDTH,
            height: GRID_NUM_Y * GRID_HEIGHT
        };

        this.pauseBtn = {
            x: this.offsetX,
            y: 400,
            width: 100,
            height: 40,
            text: '暂停',
            status: ''
        };

        this.sellBtn = {
            x: this.offsetX,
            y: 470,
            width: 100,
            height: 40,
            text: '出售',
            status: ''
        };

        this.towerArea = new TowerArea({
            ctx: this.ctx,
            x: this.offsetX,
            y: this.offsetY
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

        requestAnimationFrame(() => this.draw(), 1000);
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
        ctx.fillText(`第 ${game.wave + 1} 波`, this.offsetX, 200);
        ctx.fillText(`生命: ${game.life}`, this.offsetX, 250);
        ctx.fillText('得分: ' + game.score, this.offsetX, 300);
        ctx.fillText('金钱: ' + game.money, this.offsetX, 350);
    }

    drawButton() {
        const ctx = this.ctx;

        [this.pauseBtn, this.sellBtn].forEach(btn => {
            if (btn.status === 'hover') {
                ctx.strokeStyle = 'red';
                ctx.fillStyle = 'red';
            } else {
                ctx.strokeStyle = FILL_COLOR;
                ctx.fillStyle = FILL_COLOR;
            }
            ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
            ctx.fillText(btn.text, btn.x + btn.width / 3.5, btn.y + btn.height / 1.6);
        });
    }

    // 在游戏的控制区域绑定事件
    // TODO: 简化判断事件对应元素的逻辑
    bindEvent() {
        const $element = $(this.option.element);
        const game = this.game;
        let x = 0;
        let y = 0;

        $element.click(e => {
            const $canvas = $(e.target);
            const game = this.game;
            const offset = $canvas.offset();
            x = e.clientX - offset.left;
            y = e.clientY - offset.top;

            // 检查点击位置是否在 tower area 内
            if (isInside({ x, y }, this.towerAreaRect)) {
                const xIdx = Math.floor((x - this.offsetX) / GRID_WIDTH);
                const yIdx = Math.floor((y - this.offsetY) / GRID_HEIGHT);

                // 点击了 BaseTower
                if (xIdx === 0 && yIdx === 0) {
                    if (game.mode === 'ADD_TOWER') {
                        if (game.addTowerType !== 'BASE') {
                            game.addTowerType = 'BASE';
                            this.towerArea.selected = [0, 0];
                        } else {
                            game.mode = '';
                            game.addTowerType = '';
                        }
                    } else {
                        game.mode = 'ADD_TOWER';
                        game.addTowerType = 'BASE';
                        this.towerArea.selected = [0, 0]; // 突出显示
                    }
                } else if (xIdx === 1 && yIdx === 0) {
                    // 点击了 LaserTower
                    if (game.mode === 'ADD_TOWER' && game.addTowerType === 'LASER') {
                        game.mode = '';
                        game.addTowerType = '';
                    } else {
                        game.mode = 'ADD_TOWER';
                        game.addTowerType = 'LASER';
                        this.towerArea.selected = [1, 0];
                    }
                } else if (xIdx === 2 && yIdx === 0) {
                    // 点击了 SlowTower
                    if (game.mode === 'ADD_TOWER' && game.addTowerType === 'SLOW') {
                        game.mode = '';
                        game.addTowerType = '';
                    } else {
                        game.mode = 'ADD_TOWER';
                        game.addTowerType = 'SLOW';
                        this.towerArea.selected = [2, 0];
                    }
                }else {
                    this.towerArea.selected = -1;
                }
            } else {
                console.log('out');
            }

            if (isInside({ x, y }, this.pauseBtn)) {
                this.pauseBtn.text = game.status === 'running' ? '继续' : '暂停';
                game.status = game.status === 'running' ? 'pause' : 'running';
                if (game.status === 'running') {
                    game.draw();
                }
            }

            if (isInside({ x, y }, this.sellBtn)) {
                if (game.towerSelect === true) {
                    console.log('you sell a tower');
                    game.sellTower();
                } else {
                    // console.log('do nothing');
                }
            }
        });

        $element.mousemove(e => {
            // e.stopPropagation()
            const pauseBtn = this.pauseBtn;
            const sellBtn = this.sellBtn;
            const game = this.game;

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
            // TODO: 显示造价和伤害信息
            if (isInside({ x, y }, this.towerAreaRect)) {
                // 计算当前是在哪个格子中
                const xIdx = Math.floor((x - this.offsetX) / GRID_WIDTH);
                const yIdx = Math.floor((y - this.offsetY) / GRID_HEIGHT);

                let text = '';
                let infoX = this.offsetX + xIdx * GRID_WIDTH - 100;
                if (yIdx === 0 && xIdx === 0) {
                    text = '子弹塔：沙包大的子弹见过没有？';
                } else if (yIdx === 0 && xIdx === 1) {
                    text = '激光塔：哎哟，不错！';
                } else if (yIdx === 0 && xIdx === 2) {
                    text = '减速塔：走过，路过，不要错过！';
                    infoX -= 120;
                }

                gameInfo.infos = [{
                    x: infoX,
                    y: this.offsetY,
                    width: 200,
                    height: 50,
                    text
                }];

            } else {
                // infoCtx.clearRect(0, 0, 150, 75);
                gameInfo.infos = [];
            }
        });
    }
}

export default GameControl;

class TowerArea {
    constructor(opt) {
        this.ctx = opt.ctx;
        this.selected = -1;
        this.offsetX = opt.x;
        this.offsetY = opt.y;

        this.baseTower = new BaseTower({
            x: this.offsetX + GRID_WIDTH / 2 + 10,
            y: this.offsetY + GRID_HEIGHT / 2,
            ctx: this.ctx,
            radius: 12
        });

        this.laserTower = new LaserTower({
            x: this.offsetX + GRID_WIDTH * 1.5 + 5,
            y: this.offsetY + GRID_HEIGHT / 2,
            ctx: this.ctx,
            direction: 90,
            radius: 12
        });

        this.slowTower = new SlowTower({
            x: this.offsetX + GRID_WIDTH * 2.5 + 5,
            y: this.offsetY + GRID_HEIGHT / 2,
            ctx: this.ctx,
            radius: 12
        });
    }

    draw() {
        const ctx = this.ctx;
        ctx.strokeStyle = FILL_COLOR;
        ctx.lineWidth = 1;
        // 横线
        ctx.beginPath();
        for (let i = 0; i < GRID_NUM_Y + 1; i++) {
            ctx.moveTo(this.offsetX, i * GRID_WIDTH + this.offsetY);
            ctx.lineTo(this.offsetX + GRID_NUM_X * GRID_WIDTH, i * GRID_WIDTH + this.offsetY);
        }
        ctx.stroke();

        // 纵线
        ctx.beginPath();
        for (let i = 0; i < GRID_NUM_X + 1; i++) {
            ctx.moveTo(i * GRID_WIDTH + this.offsetX, this.offsetY);
            ctx.lineTo(i * GRID_WIDTH + this.offsetX, this.offsetY + GRID_NUM_Y * GRID_HEIGHT);
        }
        ctx.stroke();

        if (this.selected !== -1) {
            this.highlightTower(this.selected[0], this.selected[1]);
        }
        this.baseTower.draw(ctx);
        this.laserTower.draw(ctx);
        this.slowTower.draw(ctx);
    }

    // 选中的tower突出显示
    highlightTower(x, y) {
        const ctx = this.ctx;
        ctx.strokeStyle = 'pink';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x * GRID_WIDTH + this.offsetX + 3, y * GRID_HEIGHT + this.offsetY + 3);
        ctx.lineTo((x + 0.35) * GRID_WIDTH + this.offsetX + 3, y * GRID_HEIGHT + this.offsetY + 3);

        ctx.moveTo((x + 0.65) * GRID_WIDTH + this.offsetX, y * GRID_HEIGHT + this.offsetY + 3);
        ctx.lineTo((x + 1) * GRID_WIDTH + this.offsetX - 3, y * GRID_HEIGHT + this.offsetY + 3);
        ctx.lineTo(
            (x + 1) * GRID_WIDTH + this.offsetX - 3,
            (y + 0.35) * GRID_HEIGHT + this.offsetY
        );

        ctx.moveTo(
            (x + 1) * GRID_WIDTH + this.offsetX - 3,
            (y + 0.65) * GRID_HEIGHT + this.offsetY - 3
        );
        ctx.lineTo(
            (x + 1) * GRID_WIDTH + this.offsetX - 3,
            (y + 1) * GRID_HEIGHT + this.offsetY - 3
        );
        ctx.lineTo(
            (x + 0.65) * GRID_WIDTH + this.offsetX,
            (y + 1) * GRID_HEIGHT + this.offsetY - 3
        );

        ctx.moveTo(
            (x + 0.35) * GRID_WIDTH + this.offsetX,
            (y + 1) * GRID_HEIGHT + this.offsetY - 3
        );
        ctx.lineTo(x * GRID_WIDTH + this.offsetX + 3, (y + 1) * GRID_HEIGHT + this.offsetY - 3);
        ctx.lineTo(x * GRID_WIDTH + this.offsetX + 3, (y + 0.65) * GRID_HEIGHT + this.offsetY - 3);

        ctx.moveTo(x * GRID_WIDTH + this.offsetX + 3, (y + 0.35) * GRID_HEIGHT + this.offsetY);
        ctx.lineTo(x * GRID_WIDTH + this.offsetX + 3, y * GRID_HEIGHT + this.offsetY + 3);

        ctx.closePath();
        ctx.stroke();
    }
}
