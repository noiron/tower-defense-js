import Game from './js/Game';
import { gridWidth, gridHeight, gridNumX, gridNumY } from './js/utils/constant';
import SimpleTower from './js/Entity/SimpleTower';
import BulletTower from './js/Entity/BulletTower';

const game = new Game();

// 添加塔的按钮，画出图形
// SIMPLE tower
const towerCanvas1 = document.getElementById('tower1');
towerCanvas1.width = 50;
towerCanvas1.height = 50;
const ctx = towerCanvas1.getContext("2d");
const showTower1 = new SimpleTower({ ctx, x: 25, y: 25 });
showTower1.draw();
towerCanvas1.addEventListener('click', () => {
    if (game.mode === 'ADD_TOWER') {
        if (game.addTowerType !== 'SIMPLE') {
            game.addTowerType = 'SIMPLE';
        } else {
            game.mode = '';
            game.addTowerType = '';
        }
    } else {
        game.mode = 'ADD_TOWER';
        game.addTowerType = 'SIMPLE';
    }
});
console.log(towerCanvas1.toDataURL());

const tower1DataURL = towerCanvas1.toDataURL();

// BULLET tower
const towerCanvas2 = document.getElementById('tower2');
towerCanvas2.width = 50;
towerCanvas2.height = 50;
const ctx2 = towerCanvas2.getContext("2d");
const showTower2 = new BulletTower({ ctx: ctx2, x: 25, y: 25 });
showTower2.draw();
towerCanvas2.addEventListener('click', () => {
    if (game.mode === 'ADD_TOWER' && game.addTowerType === 'BULLET') {
        game.mode = '';
        game.addTowerType = '';
    } else {
        game.mode = 'ADD_TOWER';
        game.addTowerType = 'BULLET';
    }
});
// var img = new Image();
// img.src = tower1DataURL;
// img.onload = function () {
//     ctx2.drawImage(img, 0, 0);
// };


const canvas = document.getElementById("drawing");

// 在canvas上进行右键操作
canvas.oncontextmenu = function (e) {
    game.mode = '';
    e.preventDefault();
};


canvas.onmousemove = function (e) {
    if (game.mode === 'ADD_TOWER') {
        game.cursorX = e.pageX;
        game.cursorY = e.pageY;
        var rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        game.coordX = Math.floor(x / gridWidth);
        game.coordY = Math.floor(y / gridHeight);
    }
}

document.onclick = function (e) {
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
                    console.log(`You select ${index}th tower`);

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
            })
        } else {
            game.towerSelect = false;
            game.towerSelectId = -1;
            game.towerSelectIndex = -1;
        }

        if (game.mode === 'ADD_TOWER') {
            game.createNewTower(coordX, coordY, game.addTowerType);
        }
    }
    // console.log(coordX, coordY);
}

const sellButton = document.getElementById('sell-tower');
sellButton.onclick = () => {
    if (game.towerSelect === true) {
        console.log('you sell a tower');
        game.sellTower();
    } else {
        // console.log('do nothing');
    }
};

// 暂停功能
const pauseButton = document.getElementById('pause');
pauseButton.onclick = () => {
    game.status = game.status === 'running' ? 'pause' : 'running';
    if (game.status === 'running') {
        game.draw();
    }
}
