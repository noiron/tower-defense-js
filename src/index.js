import Game from './Game';
import { gridWidth, gridHeight } from './constant'; 

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
    console.log(game.score);
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
    if (game.mode === 'ADD_TOWER') {
        var rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        game.createNewTower(
            Math.floor(x / gridWidth) * gridWidth + gridWidth / 2,
            Math.floor(y / gridWidth) * gridWidth + gridWidth / 2
        );
    }
}


const vehicleCountNode = document.createElement("p");
vehicleCountNode.setAttribute("id", "vehicleCount");
const textnode = document.createTextNode(`Vehicle Count: ${game.vehicles.length}`);
vehicleCountNode.appendChild(textnode);
document.body.appendChild(vehicleCountNode);
