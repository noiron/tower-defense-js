import { vec2 } from 'gl-matrix';
import { GRID_SIZE, OFFSET_X, OFFSET_Y } from './constant';

export function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
    let rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// 根据id删除元素
Array.prototype.removeById = function(id) {
    
};

Array.prototype.getEleById = function (id) {
    let result = null;
    this.forEach((ele, i) => {
        if (ele.id === id) {
            result = ele;
        }
    });
    return result;
};

Array.prototype.getEle = function (ele) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === ele) {
            return ele;
        }
    }
    return null;
};

export function calculateDistance(x1, y1, x2, y2) {
    const result = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return result;
}

// Make sure v is smaller than high
vec2.limit = function (out, v, high) {
    'use strict';

    let x = v[0],
        y = v[1];

    let len = x * x + y * y;

    if (len > high * high && len > 0) {
        out[0] = x;
        out[1] = y;
        vec2.normalize(out, out);
        vec2.scale(out, out, high);
    }
    return out;
};

export function isInside(pos, rect) {
    return (
        pos.x > rect.x &&
        pos.x < rect.x + rect.width &&
        pos.y < rect.y + rect.height &&
        pos.y > rect.y
    );
}

/**
 * 
 * @param {*} ctx 
 * @param {*} x  top left x coordinate
 * @param {*} y  top left y coordinate
 * @param {*} WIDTH grid's width
 * @param {*} HEIGHT grid's height
 *       ____
 *      |    |
 *      |____|
 */
export function highlightGrid(ctx, x, y, WIDTH, HEIGHT) {
    const LW = 3;   // lineWidth
    const innerWidth = WIDTH - LW;
    const innerHeight = HEIGHT - LW;
    const lowRatio = 0.35;
    const upRatio = 1 - lowRatio;

    ctx.save();
    ctx.strokeStyle = 'pink';
    ctx.lineWidth = LW;

    ctx.beginPath();
    ctx.moveTo(x + LW, y + LW);
    ctx.lineTo(x + lowRatio * WIDTH + LW, y + LW);

    ctx.moveTo(x + upRatio * WIDTH, y + LW);
    ctx.lineTo(x + innerWidth, y + LW);
    ctx.lineTo(x + innerWidth, y + lowRatio * HEIGHT);

    ctx.moveTo(x + innerWidth, y + upRatio * HEIGHT - LW);
    ctx.lineTo(x + innerWidth, y + innerHeight);
    ctx.lineTo(x + upRatio * WIDTH, y + innerHeight);

    ctx.moveTo(x + lowRatio * WIDTH, y + innerHeight);
    ctx.lineTo(x + LW, y + innerHeight);
    ctx.lineTo(x + LW, y + upRatio * HEIGHT - LW);

    ctx.moveTo(x + LW, y + lowRatio * HEIGHT);
    ctx.lineTo(x + LW, y + LW);

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

/**
 * 根据一个格子的行和列，计算出其中心在坐标系中用像素表示的坐标
 * @param {number} col 处于第几列，对应于x坐标
 * @param {number} row 处于第几行，对应于y坐标
 */
export function index2Px(col, row, gridSize = GRID_SIZE) {
    const offsetX = OFFSET_X;
    const offsetY = OFFSET_Y;

    const x = col * gridSize + gridSize * 0.5 + offsetX;
    const y = row * gridSize + gridSize * 0.5 + offsetY;

    return {x, y};
}

/**
 * 根据一个点在canvas上的像素坐标，计算出其所在格子的行和列
 * @param {number} x x坐标
 * @param {number} y y坐标
 */
export function px2Index(x, y, gridSize = GRID_SIZE) {
    const offsetX = OFFSET_X;
    const offsetY = OFFSET_Y;

    const col = Math.floor((x - offsetX) / gridSize);
    const row = Math.floor((y - offsetY) / gridSize);

    return {col, row};
}

console.log(px2Index(108, 219));
console.log(index2Px(px2Index(108, 219).col, px2Index(108, 219).row));


export function drawGrid(ctx, cols, rows, gridSize = GRID_SIZE, strokeStyle = '#aaa', offsetX = 0, offsetY = 0) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Draw vertical lines
    ctx.moveTo(offsetX - 0.5, offsetY);
    ctx.lineTo(offsetX - 0.5, rows * gridSize + offsetY);
    for (let i = 0; i < cols + 1; i++) {
        ctx.moveTo(i * gridSize - 0.5 + offsetX, offsetY);
        ctx.lineTo(i * gridSize - 0.5 + offsetX, rows * gridSize + offsetY);
    }
    ctx.stroke();
    
    // Draw horizontal lines
    ctx.moveTo(offsetX, offsetY - 0.5);
    ctx.lineTo(cols * gridSize + offsetX, offsetY - 0.5);
    for (let i = 0; i < rows + 1; i++) {
        ctx.moveTo(offsetX, i * gridSize - 0.5 + offsetY);
        ctx.lineTo(cols * gridSize + offsetX, i * gridSize - 0.5 + offsetY);
    }
    ctx.stroke();
}