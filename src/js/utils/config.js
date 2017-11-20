import { gridNumX, gridNumY } from './constant';

export const config = {
    renderShadow: false
};

const cols = gridNumX;  // 16
const rows = gridNumY;  // 12

// 地图路径坐标
export const orbit = {
    1: [[9, 0], [9, rows]],
    2: [[0, 1], [cols - 4, 1], [cols - 4, 4], [6, 4], [6, 8], [cols - 2, 8], [cols - 2, rows - 1], [-1, rows - 1]],
    3: [[6, 0], [6, 5], [8, 5], [8, rows]],
};
