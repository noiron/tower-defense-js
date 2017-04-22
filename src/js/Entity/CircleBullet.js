import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import { toRadians } from './../utils/utils';

export default class Bullet1 {
    constructor({ ctx, x, y, target }) {
        this.type = 'circle';
        this.x = x;
        this.y = y;
        this.target = target;
        this.radius = 3;
        this.speed = 5;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.hue = 200;
    }


    draw(ctx) {
        // 新位置
        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            this.angle = Math.atan2(dy, dx);
        }
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        this.x += this.vx;
        this.y += this.vy;

        // 绘图开始
        ctx.save();
        ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, 80%)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
}