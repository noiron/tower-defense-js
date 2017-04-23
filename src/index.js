import Game from './js/Game';
import { gridWidth, gridHeight, gridNumX, gridNumY } from './js/utils/constant';

const game = new Game();

const addTowerBlock = document.getElementById('add-tower');
addTowerBlock.addEventListener('click', () => {
    game.mode = game.mode === 'ADD_TOWER' ? '' : 'ADD_TOWER';
});

const canvas = document.getElementById("drawing");

// 在canvas上进行右键操作
canvas.oncontextmenu = function (e) {
    game.mode = '';
    e.preventDefault();
};


document.onmousemove = function (e) {
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
            game.createNewTower(coordX, coordY, 'SIMPLE');
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


const vehicleCountNode = document.createElement("p");
vehicleCountNode.setAttribute("id", "enemyCount");
const textnode = document.createTextNode(`Enemy Count: ${game.enemies.length}`);
vehicleCountNode.appendChild(textnode);
document.body.appendChild(vehicleCountNode);
