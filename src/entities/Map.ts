/**
 * 地图上不同种类的 grid 的标记
 * DEFAULT: 默认状态，enemy 能够通过，能够放置 tower
 * BLOCK: 障碍物，enemy 不能通过，不能放置 tower
 * PLATFORM: 平台，enemy 不能通过，但能放置 tower
 * PATH: enemy 通行的道路，不能放置 tower
 */

import { GRID_SIZE, gridNumX, gridNumY, OFFSET_X, OFFSET_Y } from '@/constants';
import Path from './Path';
import { highlightGrid, drawGrid, index2Px, px2Index } from '../utils';
import { Graph, BreadthFirstSearch } from '../utils/BreadthFirstSearch';
import globalId from '../id';
import TowerFactory, { BaseTower } from './towers/index';
import { MAP_SETTING } from '../utils/config';
import Game from '@/Game';

interface Option {
  ctx: CanvasRenderingContext2D;
  newTowerCoord: [number, number];
  orbit: any;
  WIDTH: number;
  HEIGHT: number;
  path?: Path;
  game: Game;
}

interface Map extends Option {
  graph: Graph;
  coord: any[];
};

class Map implements Option {
  constructor(opt: Option) {
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
      orbit: this.orbit,
    });

    // 初始化坐标
    const game = opt.game;
    this.game = game;

    // @ts-ignore
    const mapSetting = MAP_SETTING[game.stage];
    if (mapSetting) {
      /* 默认情况下路径以给出的 orbit 为准，如果存在 mapSetting，则重新寻找路径 */
      // @ts-ignore
      const blockArray = MAP_SETTING[game.stage].BLOCK;
      blockArray.forEach((block: any) => {
        const [col, row] = block;
        this.coord[col][row] = 'B';
        const { x, y } = index2Px(col, row);
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
    for (let i = 0; i < gridNumX; i++) {
      for (let j = 0; j < gridNumY; j++) {
        // 清除之前的路径标记，0 表示空白方块
        if (this.coord[i][j] === 'P') {
          this.coord[i][j] = 0;
        }
      }
    }

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

  draw({ towers, towerSelect, towerSelectIndex }: {
    towers: BaseTower[],
    towerSelect: boolean,
    towerSelectIndex: number,
  }) {
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

    drawGrid(ctx, gridNumX, gridNumY, GRID_SIZE, '#eee', OFFSET_X, OFFSET_Y);

    // 当前选中的格子突出显示
    if (towerSelect) {
      const { col, row } = towers[towerSelectIndex];
      const { x, y } = index2Px(col, row);
      highlightGrid(
        ctx,
        x - GRID_SIZE / 2,
        y - GRID_SIZE / 2,
        GRID_SIZE,
        GRID_SIZE
      );
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
    pathArr.forEach((p) => this.orbit.push(p));

    this.path = new Path({
      ctx: this.ctx,
      orbit: this.orbit,
    });

    // Add points to the path
    this.path.setPoints();
    this.setMap();
  }

  findPointPath([x, y]: [number, number]) {
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
  checkPath(col: number, row: number) {
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

    return this.game.enemies.every((enemy) => {
      const { col, row } = px2Index(enemy.x, enemy.y);
      if (col === endPoint[0] && row === endPoint[1]) {
        return true;
      }

      const pathArr = bfs.findPath([col, row]);
      return pathArr.length > 0;
    });
  }
}

export default Map;
