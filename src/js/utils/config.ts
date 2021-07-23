import { gridNumX, gridNumY } from '../constants';

export const config = {
  renderShadow: false,
};

export const cfgPlayAudio = false;

const cols: number = gridNumX; // 16
const rows: number = gridNumY; // 12

// 地图路径坐标
export const orbit = {
  1: [
    [1, 0],
    [1, rows - 1],
  ],
  2: [
    [0, 1],
    [cols - 4, 1],
    [cols - 4, 4],
    [6, 4],
    [6, 8],
    [cols - 2, 8],
    [cols - 2, rows - 1],
    [0, rows - 1],
  ],
  3: [
    [6, 0],
    [6, 5],
    [8, 5],
    [8, rows - 1],
  ],
};

export const MAP_SETTING = {
  3: {
    BLOCK: [
      [5, 3],
      [5, 4],
      [6, 4],
      [7, 4],
      [8, 4],
      [7, 8],
      [8, 8],
      [9, 8],
    ],
  },
};
