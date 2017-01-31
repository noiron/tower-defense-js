import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import { toRadians } from '../utils';

export default class Bullet {
    constructor(ctx, x, y, directionVec) {
        this.x = x;
        this.y = y;
        this.length = 100;
        this.hue = 200;
        this.velocity = vec2.create();
        vec2.scale(this.velocity, directionVec, 5);
        
        this.length = 10;
        // 从bullet的起点指向终点的向量
        this.end = vec2.create();
        vec2.scale(this.end, directionVec, this.length);
    }


    draw(ctx) {
        this.x += this.velocity[0];
        this.y += this.velocity[1];

        ctx.save();
        ctx.strokeStyle = 'hsl(' + this.hue + ',100%,80%';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.end[0], this.y + this.end[1]);
        ctx.stroke();
        ctx.restore();
    }
}