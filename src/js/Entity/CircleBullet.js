import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import { toRadians } from './../utils/utils';

export default class Bullet1 {
    constructor({ ctx, x, y }) {
        this.type = 'circle';
        this.x = x;
        this.y = y;
        this.radius = 2;
    }


    draw(ctx) {
        // 绘图开始
        ctx.save();
        ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, 80%)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
}