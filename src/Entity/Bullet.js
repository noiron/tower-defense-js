import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import { toRadians } from './../utils/utils';

export default class Bullet {
    constructor(ctx, x, y, directionVec) {
        this.x = x;
        this.y = y;
        this.directionVec = directionVec;

        // {vec2} this.start 表示起点位置的向量
        this.start = vec2.fromValues(x, y);

        this.hue = 200;

        // {vec2} this.velocity 表示bullet速度的向量
        // 将表示方向的单位向量乘以速率，得到速度向量
        this.velocity = vec2.create();
        vec2.scale(this.velocity, directionVec, 2);

        // bullet的长度
        this.length = 10;
        // 从bullet的起点指向终点的向量
        this.bulletVec = vec2.create();
        vec2.scale(this.bulletVec, directionVec, this.length);

        // {vec2} this.end 表示终点位置的向量
        this.end = vec2.create();
        this.end = vec2.add(this.end, this.start, this.bulletVec);
    }


    draw(ctx) {
        // bullet运动后的起点和终点位置
        vec2.add(this.start, this.start, this.velocity);
        vec2.add(this.end, this.end, this.velocity);

        // 绘图开始
        ctx.save();
        ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, 80%)';
        ctx.beginPath();
        ctx.moveTo(this.start[0], this.start[1]);
        ctx.lineTo(this.end[0], this.end[1]);
        ctx.stroke();
        ctx.restore();
    }
}