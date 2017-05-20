import vec2 from 'gl-matrix/src/gl-matrix/vec2';

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
    
}

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
}

export function calcuteDistance(x1, y1, x2, y2) {
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