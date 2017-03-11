import Game from './Game';

const game = new Game();

const addTowerBlock = document.getElementById('add-tower');
addTowerBlock.addEventListener('click', () => {
    game.mode = game.mode === 'ADD_TOWER' ? '' : 'ADD_TOWER';
});


document.onmousemove = function (e) {
    if (game.mode === 'ADD_TOWER') {
        game.cursorX = e.pageX;
        game.cursorY = e.pageY;
    }
}

document.onclick = function (e) {
    if (game.mode === 'ADD_TOWER') {
        game.createNewTower(e.pageX, e.pageY);
    }
}


const vehicleCountNode = document.createElement("p");
vehicleCountNode.setAttribute("id", "vehicleCount");
const textnode = document.createTextNode(`Vehicle Count: ${game.vehicles.length}`);
vehicleCountNode.appendChild(textnode);
document.body.appendChild(vehicleCountNode);
