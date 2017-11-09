import Game from './js/Game';
import GameControl from './js/Entity/GameControl';
import GameInfo from './js/Entity/GameInfo';
import {
    gridWidth,
    gridHeight,
    gridNumX,
    gridNumY,
    towerDataURL
} from './js/utils/constant';
import BaseTower from './js/Entity/tower/BaseTower';
import BulletTower from './js/Entity/tower/BulletTower';

const game = new Game({
    element: document.getElementById('drawing')
});
// window.game = game;

const gameControlEle = document.getElementById('game-control');
export const gameControl = new GameControl({
    element: gameControlEle,
    game
});
gameControl.draw();

const $gameInfo = document.getElementById('game-info');
export const gameInfo = new GameInfo({
    element: $gameInfo,
    game
});
gameInfo.draw();

const canvas = document.getElementById('drawing');

// 在canvas上进行右键操作
canvas.oncontextmenu = function(e) {
    game.mode = '';
    e.preventDefault();
};

document.onmousemove = function(e) {
    if (game.mode === 'ADD_TOWER') {
        game.cursorX = e.pageX;
        game.cursorY = e.pageY;
        var rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        game.coordX = Math.floor(x / gridWidth);
        game.coordY = Math.floor(y / gridHeight);
    }
};

document.onclick = function(e) {
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const coordX = Math.floor(x / gridWidth);
    const coordY = Math.floor(y / gridHeight);

    /* 只在地图范围内进行操作 */
    if (0 <= coordX && coordX < gridNumX && 0 <= coordY && coordY < gridNumY) {
        if (game.map.coord[coordX][coordY] === 'T') {
            // 点击的格子内为塔
            game.towers.map((tower, index) => {
                if (tower.coordX === coordX && tower.coordY === coordY) {
                    console.log(`You select ${index}th tower, its id is ${tower.id}`);

                    // 已经选中的塔再次点击则取消
                    if (game.towerSelectIndex === index) {
                        game.towerSelectIndex = -1;
                        game.towerSelectId = -1;
                        game.towerSelect = false;
                    } else {
                        game.towerSelectIndex = index;
                        game.towerSelectId = tower.id;
                        game.towerSelect = true;
                    }
                }
            });
        } else {
            game.towerSelect = false;
            game.towerSelectId = -1;
            game.towerSelectIndex = -1;
        }

        if (game.mode === 'ADD_TOWER') {
            game.createNewTower(coordX, coordY, game.addTowerType);
        }
    }
};
