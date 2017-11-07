import { vec2 } from 'gl-matrix';
import { toRadians, calcuteDistance } from './../../utils/utils';

export default class Laser {
    constructor({ ctx, x, y, parent, target, range, damage }) {
        this.type = 'laser';
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.target = target;
        this.width = 5;
        // this.speed = 8;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.hue = 100;
        this.range = range;
        this.damage = damage || 5;
        this.parent = parent;
    }

    step() {
        const parent = this.parent;
        this.x = parent.x + parent.bulletStartPosVec[0];
        this.y = parent.y + parent.bulletStartPosVec[1];
    }

    draw(ctx, enemies) {
        this.step();

        // 绘图开始
        ctx.save();
        ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, 40%)';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.target.x, this.target.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}