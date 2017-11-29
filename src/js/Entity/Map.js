/**
 * 地图上不同种类的 grid 的标记
 * DEFAULT: 默认状态，enemy 能够通过，能够放置 tower
 * BLOCK: 障碍物，enemy 不能通过，不能放置 tower
 * PLATFORM: 平台，enemy 不能通过，但能放置 tower  
 * PATH: enemy 通行的道路，不能放置 tower
 */

import { GRID_SIZE, gridNumX, gridNumY } from './../utils/constant';
import Path from './Path';
import { highlightGrid } from '../utils/utils';
import { Graph, BreadthFirstSearch } from '../utils/BreadthFirstSearch';
import globalId from './../id';
import TowerFactory from './tower/index';
import { MAP_SETTING } from '../utils/config';

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
            radius: GRID_SIZE / 2,
            orbit: this.orbit
        });


        // 初始化坐标
        const game = opt.game;
        this.game = game;

        const mapSetting = MAP_SETTING[game.stage];
        if (mapSetting) {
            /* 默认情况下路径以给出的 orbit 为准，如果存在 mapSetting，则重新寻找路径 */
            const blockArray = MAP_SETTING[game.stage].BLOCK;
            blockArray.forEach(block => {
                const [col, row] = block;
                this.coord[col][row] = 'B';
                const x = col * GRID_SIZE + GRID_SIZE / 2;
                const y = row * GRID_SIZE + GRID_SIZE / 2;
                const id = globalId.genId();
                const config = { id, ctx: this.ctx, x, y };
                const tower = new TowerFactory['BLOCK'](config);
                game.towers.push(tower);
            });
            
            this.findPath();
        } else {
            this.path.setPoints();
            this.setMap();
        }
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
            ctx.moveTo(i * GRID_SIZE - 0.5, 0);
            ctx.lineTo(i * GRID_SIZE - 0.5, size * GRID_SIZE);
        }
        ctx.stroke();

        // Draw horizontal lines
        for (i = 0; i < size + 1; i++) {
            ctx.moveTo(0, i * GRID_SIZE - 0.5);
            ctx.lineTo(size * GRID_SIZE, i * GRID_SIZE - 0.5);
        }
        ctx.stroke();

        // 当前选中的格子突出显示
        if (towerSelect) {
            const { col, row } = towers[towerSelectIndex];
            highlightGrid(ctx, col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
        // // 空白格子也突出显示
        // else if (this.selectCoord) {
        //     const { col, row } = this.selectCoord;
        //     if (this.coord[col][row] !== 'P') {
        //         highlightGrid(ctx, col * gridWidth, row * gridHeight, gridWidth, gridHeight);            
        //     }
        // }

        ctx.restore();

        this.path.draw();
    }


    // 寻找路径
    findPath() {
        const graph = new Graph(gridNumX, gridNumY);
        this.graph = graph;
        for (let j = 0; j < gridNumY; j++) {
            for (let i = 0; i < gridNumX; i++) {
                // 标记地图中的障碍物
                if (this.coord[i][j] === 'B' || this.coord[i][j] === 'T') {
                    graph.walls.push([i, j]);
                }
            }
        }

        const startPoint = this.orbit[0];
        const endPoint = this.orbit[this.orbit.length - 1];
        const bfs = new BreadthFirstSearch(graph, endPoint);
        const pathArr = bfs.findPath(startPoint);
        this.orbit = [];
        pathArr.forEach(p => this.orbit.push(p));
                
        this.path = new Path({
            ctx: this.ctx,
            orbit: this.orbit
        });
        
        // Add points to the path
        this.path.setPoints();
        this.setMap();
    }

    findPointPath([x, y]) {
        const graph = this.graph;

        const endPoint = this.orbit[this.orbit.length - 1];
        const bfs = new BreadthFirstSearch(graph, endPoint);
        const pathArr = bfs.findPath([x, y]);

        return pathArr;
    }

    /**
     * 检查在该位置放置障碍物后，起点和终点间是否存在一条路径，
     * 以及所有的 enemy 是否能够到达终点
     */
    checkPath(col, row) {
        const graph = new Graph(gridNumX, gridNumY);
        for (let j = 0; j < gridNumY; j++) {
            for (let i = 0; i < gridNumX; i++) {
                // 标记地图中的障碍物
                if (this.coord[i][j] === 'B' || this.coord[i][j] === 'T') {
                    graph.walls.push([i, j]);
                }
            }
        }
        graph.walls.push([col, row]);

        const startPoint = this.orbit[0];
        const endPoint = this.orbit[this.orbit.length - 1];
        const bfs = new BreadthFirstSearch(graph, endPoint);
        const startArr = bfs.findPath(startPoint);
        if (startArr.length === 0) {
            return false;
        }

        return this.game.enemies.every(enemy => {
            const col = Math.floor(enemy.x / GRID_SIZE);
            const row = Math.floor(enemy.y / GRID_SIZE);
            if (col === endPoint[0] && row === endPoint[1]) {
                return true;
            }

            const pathArr = bfs.findPath([col, row]);
            return pathArr.length > 0;
        });
    }
}

