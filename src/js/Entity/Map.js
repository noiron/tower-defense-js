import { gridWidth, gridHeight, gridNumX, gridNumY } from './../utils/constant';
import Path from './Path';

export default class Map {
    constructor(opt) {
        this.ctx = opt.ctx;
        this.newTowerCoord = opt.newTowerCoord || null;
        this.pathCoord = opt.pathCoord;
        this.WIDTH = opt.WIDTH,
            this.HEIGHT = opt.HEIGHT,
            this.coord = [];

        for (let i = 0; i < gridNumX; i++) {
            this.coord[i] = [];
        }

        // 初始状态下的塔
        if (this.newTowerCoord) {
            this.coord[this.newTowerCoord[0]][this.newTowerCoord[1]] = 'T';
        }

        // Create an instance of Path object
        this.path = new Path({
            ctx: this.ctx,
            radius: gridWidth / 2,
            pathCoord: this.pathCoord
        });

        // Add points to the path
        this.path.setPoints();
    }

    draw() {
        const ctx = this.ctx;
        const WIDTH = this.WIDTH;
        const HEIGHT = this.HEIGHT;

        ctx.save();

        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.strokeStyle = '#ddd';
        ctx.fillStyle = '#666';
        ctx.lineWidth = 1;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        // 横纵数目相等
        var size = 20;

        ctx.beginPath();
        // Draw vertical lines
        for (var i = 0; i < size + 1; i++) {
            ctx.moveTo(i * gridWidth, 0);
            ctx.lineTo(i * gridWidth, size * gridHeight);
        }
        ctx.stroke();

        // Draw horizontal lines
        for (i = 0; i < size + 1; i++) {
            ctx.moveTo(0, i * gridWidth);
            ctx.lineTo(size * gridWidth, i * gridWidth);
        }
        ctx.stroke();

        // 当前选中的格子突出显示
        if (this.towerSelect) {
            const coordX = this.towers[this.towerSelectIndex].coordX;
            const coordY = this.towers[this.towerSelectIndex].coordY;

            fillGrid(coordX, coordY, 'red')
        }

        // 给一个格子上色
        function fillGrid(x, y, color) {
            ctx.fillStyle = color || "#666";
            ctx.fillRect(x * gridWidth + 1, y * gridHeight + 1, gridWidth - 2, gridHeight - 2);
        }

        ctx.restore();

        this.path.draw();
    }
}

