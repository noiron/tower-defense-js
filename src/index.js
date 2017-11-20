import Game from './js/Game';
import { WIDTH, HEIGHT, GAME_CONTROL_WIDTH, GAME_CONTROL_HEIGHT } from './js/utils/constant';
let stage = 1;
let game = {};

function beginGame() {
    game = new Game({
        element: document.getElementById('drawing'),
        stage
    });
    world.game = game;
    world.stage = stage;

    // FIXME: JUST FOR DEBUG
    window.game = game;
}

// 游戏的全部状态保存在该对象中
export const world = {};
window.world = world;

const BORDER_WIDTH = 6;

const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const backgroundCanvas = document.getElementById('background');
const bgCtx = backgroundCanvas.getContext('2d');
backgroundCanvas.width = WIDTH + GAME_CONTROL_WIDTH;
backgroundCanvas.height = HEIGHT;

const gameControlCanvas = document.getElementById('game-control');
gameControlCanvas.width = GAME_CONTROL_WIDTH;
gameControlCanvas.height = GAME_CONTROL_HEIGHT;

const panels = document.getElementById('panels');

const gameInfoCanvas = document.getElementById('game-info');

const chooseStage = document.getElementById('choose-stage');
const chooseStageButtons = document.getElementsByClassName('choose-stage-button');
// 点击按钮选择不同的 stage
Array.prototype.forEach.call(chooseStageButtons, b => {
    b.addEventListener('click', chooseStageHandler, false);
});

const status = document.getElementById('status');

function chooseStageHandler(e) {
    stage = e.target.dataset.stage;
    chooseStage.style.display = 'none';
    beginGame(stage);
}

function windowResizeHandler() {
    // 确定canvas的位置
    const cvx = (window.innerWidth - WIDTH - GAME_CONTROL_WIDTH) * 0.5;
    const cvy = (window.innerHeight - HEIGHT) * 0.5;

    canvas.style.position = 'absolute';
    canvas.style.left = cvx + 'px';
    canvas.style.top = cvy + 'px';

    backgroundCanvas.style.position = 'absolute';
    backgroundCanvas.style.left = cvx + BORDER_WIDTH + 'px';
    backgroundCanvas.style.top = cvy + BORDER_WIDTH + 'px';

    status.style.position = 'absolute';
    status.style.left = cvx + BORDER_WIDTH + 'px';
    status.style.top = cvy + BORDER_WIDTH + 'px';

    gameControlCanvas.style.position = 'absolute';
    gameControlCanvas.style.left = cvx + WIDTH + BORDER_WIDTH + 'px';
    gameControlCanvas.style.top = cvy + 'px';

    panels.style.position = 'absolute';
    panels.style.left = cvx + BORDER_WIDTH + 'px';
    panels.style.top = cvy + 200 + 'px';

    gameInfoCanvas.style.position = 'absolute';
    gameInfoCanvas.style.left = cvx + BORDER_WIDTH + 'px';
    gameInfoCanvas.style.top = cvy + BORDER_WIDTH + 'px';

    chooseStage.style.position = 'absolute';
    chooseStage.style.left = cvx + BORDER_WIDTH + 'px';
    chooseStage.style.top = cvy + BORDER_WIDTH + 'px';
}

window.addEventListener('resize', windowResizeHandler, false);

function renderBackground() {
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

windowResizeHandler();
renderBackground();
