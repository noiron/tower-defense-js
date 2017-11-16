import { gridWidth, gridHeight, gridNumX, gridNumY } from './../utils/constant';
import Path from './Path';
import { highlightGrid } from '../utils/utils';

export default class Map {
    constructor(opt) {
        this.ctx = opt.ctx;
        this.newTowerCoord = opt.newTowerCoord || null;
        this.orbit = opt.orbit;
        this.WIDTH = opt.WIDTH;
        this.HEIGHT = opt.HEIGHT;
        
        this.coord = [];

        for (let i = 0; i < gridNumX; i++) {
            this.coord[i] = [];
        }

        // 初始状态下的塔
        if (this.newTowerCoord) {
            const [col, row] = this.newTowerCoord;
            this.coord[col][row] = 'T';
        }

        // Create an instance of Path object
        this.path = new Path({
            ctx: this.ctx,
            radius: gridWidth / 2,
            orbit: this.orbit
        });

        // Add points to the path
        this.path.setPoints();
        this.setMap();
    }

    // 设置地图数组
    // 路径所在位置标识为 'P'
    setMap() {
        const path = this.path.orbit;
        for (let i = 0; i < path.length - 1; i++) {
            const current = path[i];
            const next = path[i + 1];
            if (current[0] === next[0]) {
                /* x 坐标相等，y 坐标进行变化 */
                const x = current[0];

                const minY = Math.max(Math.min(current[1], next[1]), 0);
                const maxY = Math.min(Math.max(current[1], next[1]), gridNumY);

                for (let y = minY; y <= maxY; y++) {
                    this.coord[x][y] = 'P';
                }
                
            } else if (current[1] === next[1]) {
                /* y 坐标相等，x 坐标进行变化 */
                const y = current[1];

                const minX = Math.max(Math.min(current[0], next[0]), 0);
                const maxX = Math.min(Math.max(current[0], next[0]), gridNumX);

                for (let x = minX; x <= maxX; x++) {
                    this.coord[x][y] = 'P';
                }
            }
        }
    }

    draw({towers, towerSelect, towerSelectIndex}) {
        const ctx = this.ctx;
        const WIDTH = this.WIDTH;
        const HEIGHT = this.HEIGHT;

        ctx.save();

        // Clear canvas
        // ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.strokeStyle = '#eee';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        // ctx.fillRect(0, 0, WIDTH, HEIGHT);
        // 横纵数目相等
        const size = 20;

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
        if (towerSelect) {
            const { col, row } = towers[towerSelectIndex];
            highlightGrid(ctx, col * gridWidth, row * gridHeight, gridWidth, gridHeight);
        }

        ctx.restore();

        this.path.draw();
    }
}

