import BaseTower from './tower/BaseTower';
import BulletTower from './tower/BulletTower';

const GRID_WIDTH = 60;
const GRID_HEIGHT = 60;
const GRID_NUM_X = 3;
const GRID_NUM_Y = 2;
const WIDTH = 250;
const HEIGHT = 640;

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

        this.towerArea = {
            x: this.offsetX,
            y: this.offsetY,
            width: GRID_NUM_X * GRID_WIDTH,
            height: GRID_NUM_Y * GRID_HEIGHT
        };

        this.pauseBtn = {
            x: this.offsetX,
            y: 350,
            width: 100,
            height: 40,
            text: 'Pause',
            status: ''
        };

        this.sellBtn = {
            x: this.offsetX,
            y: 420,
            width: 100,
            height: 40,
            text: 'Sell',
            status: ''
        };

        this.bindEvent();
    }

    draw() {
        const ctx = this.ctx;
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.drawGrid();
        this.drawText();
        this.drawButton();

        const baseTower = new BaseTower({
            x: this.offsetX + GRID_WIDTH / 2 + 10,
            y: this.offsetY + GRID_HEIGHT / 2,
            ctx,
            radius: 12
        });
        baseTower.draw(ctx);

        const bulletTower = new BulletTower({
            x: this.offsetX + GRID_WIDTH * 1.5 + 10,
            y: this.offsetY + GRID_HEIGHT / 2,
            ctx,
            direction: 180,
            radius: 12
        });
        bulletTower.draw(ctx);

        requestAnimationFrame(() => this.draw(), 100);
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

        ctx.lineWidth = 1;
        // 横线
        ctx.beginPath();
        for (let i = 0; i < GRID_NUM_Y + 1; i++) {
            ctx.moveTo(this.offsetX, i * GRID_WIDTH + this.offsetY);
            ctx.lineTo(
                this.offsetX + GRID_NUM_X * GRID_WIDTH,
                i * GRID_WIDTH + this.offsetY
            );
        }
        ctx.stroke();

        // 纵线
        ctx.beginPath();
        for (let i = 0; i < GRID_NUM_X + 1; i++) {
            ctx.moveTo(i * GRID_WIDTH + this.offsetX, this.offsetY);
            ctx.lineTo(
                i * GRID_WIDTH + this.offsetX,
                this.offsetY + GRID_NUM_Y * GRID_HEIGHT
            );
        }
        ctx.stroke();
    }

    drawText() {
        const ctx = this.ctx;
        const game = this.game;
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText('Score:' + game.score, this.offsetX, 250);
        ctx.fillText('Money:' + game.money, this.offsetX, 300);
    }

    drawButton() {
        const ctx = this.ctx;
        // console.log(this.sellBtn);

        [this.pauseBtn, this.sellBtn].forEach(btn => {
            if (btn.status === 'hover') {
                ctx.strokeStyle = 'red';
                ctx.fillStyle = 'red';
            } else {
                ctx.strokeStyle = '#000';
                ctx.fillStyle = '#000';
            }
            ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
            ctx.fillText(
                btn.text,
                btn.x + btn.width / 5,
                btn.y + btn.height / 1.6
            );
        });
    }

    // 在游戏的控制区域绑定事件
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
            if (isInside({ x, y }, this.towerArea)) {
                const xIdx = Math.floor((x - this.offsetX) / GRID_WIDTH);
                const yIdx = Math.floor((y - this.offsetY) / GRID_HEIGHT);

                // 点击了 BaseTower
                if (xIdx === 0 && yIdx === 0) {
                    if (game.mode === 'ADD_TOWER') {
                        if (game.addTowerType !== 'BASE') {
                            game.addTowerType = 'BASE';
                        } else {
                            game.mode = '';
                            game.addTowerType = '';
                        }
                    } else {
                        game.mode = 'ADD_TOWER';
                        game.addTowerType = 'BASE';
                    }
                } else if (xIdx === 1 && yIdx === 0) {
                    // 点击了 BulletTower
                    if (
                        game.mode === 'ADD_TOWER' &&
                        game.addTowerType === 'BULLET'
                    ) {
                        game.mode = '';
                        game.addTowerType = '';
                    } else {
                        game.mode = 'ADD_TOWER';
                        game.addTowerType = 'BULLET';
                    }
                }
            } else {
                console.log('out');
            }

            if (isInside({ x, y }, this.pauseBtn)) {
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
        });
    }
}

export default GameControl;

function isInside(pos, rect) {
    return (
        pos.x > rect.x &&
        pos.x < rect.x + rect.width &&
        pos.y < rect.y + rect.height &&
        pos.y > rect.y
    );
}
