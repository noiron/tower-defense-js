import Game from './Game';

const game = new Game();

// window.addEventListener('resize', onResize, false);

const node = document.createElement("p");
node.setAttribute("id", "vehicleCount");
const textnode = document.createTextNode(`Vehicle Count: ${game.vehicles.length}`);
node.appendChild(textnode);
document.body.appendChild(node);
