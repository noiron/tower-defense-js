export const WIDTH = 800;
export const HEIGHT = 650;

export const GAME_CONTROL_WIDTH = 230;
export const GAME_CONTROL_HEIGHT = 650;

export const GRID_SIZE = 50;
export const gridWidth = GRID_SIZE;
export const gridHeight = GRID_SIZE;

export const gridNumX = Math.floor(WIDTH / gridWidth);  // x轴方向上的格子数目
export const gridNumY = Math.floor(HEIGHT / gridHeight);  // y轴方向上的格子数目

export const FRAMERATE = 60;

export const OFFSET_X = 50;
export const OFFSET_Y = 50;

export const towerData = {
    BASE: {
        cost: 200,
        info: '子弹塔：沙包大的子弹见过没有？'
    },
    LASER: {
        cost: 200,
        info: '激光塔：哎哟，不错！'
    },
    SLOW: {
        cost: 600,
        info: '减速塔：Yo, Yo, Yo, 留下来！'
    },
    FIRE: {
        cost: 400,
        info: '火焰塔：啊哈，你想被烤成几分熟？'
    },
    BLOCK: {
        cost: 50,
        info: ''
    }
};
