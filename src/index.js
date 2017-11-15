import Game from './js/Game';
let stage = 1;
let game = {};

function beginGame() {
    game.status = 'gameOver';
    game = new Game({
        element: document.getElementById('drawing'),
        stage
    });
    // FIXME: JUST FOR DEBUG
    window.game = game;
}

beginGame();

// 游戏的全部状态保存在该对象中
const world = {
    stage,
    game
};
window.world = world;

