import Bullet from './Bullet.js';
import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import { toRadians } from '../utils';
import { config } from '../config';

export default class SimpleTower {
    constructor(ctx, x, y, bullets) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.hue = 200;
        this.bullets = bullets;
        this.lastShootTime = new Date();
        this.direction = 180;     // 用度数表示的tower指向
        this.bulletStartPosVec = vec2.fromValues(0, 0);
        this.directionVec = vec2.create();

    }

    draw(ctx) {
        // 将方向向量归一化
        this.directionVec = vec2.fromValues(
            Math.cos(toRadians(this.direction)),
            Math.sin(toRadians(this.direction))
        );
        vec2.normalize(this.directionVec, this.directionVec);

        // bullet 出射位置
        
        vec2.scale(this.bulletStartPosVec, this.directionVec, 30);

        ctx.save();
        if (config.renderShadow) {
            ctx.shadowBlur = this.radius;
            ctx.shadowColor = 'hsl(' + this.hue + ',100%,60%)';
        }

        ctx.strokeStyle = 'hsl(' + this.hue + ',100%,80%';
        ctx.fillStyle = 'hsl(' + this.hue + ',100%,80%';
        ctx.lineWidth = Math.max(3, this.radius / 8);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.bulletStartPosVec[0], this.y + this.bulletStartPosVec[1]);
        ctx.stroke();
        ctx.closePath();

        if (new Date - this.lastShootTime >= 400) {
            this.shoot(ctx);
            this.lastShootTime = new Date();
        }

        this.direction = (this.direction + 0.2) % 360;

        ctx.restore();
    };

    // 发射子弹
    shoot(ctx) {
        this.bullets.push(new Bullet(
            ctx,
            this.x + this.bulletStartPosVec[0],
            this.y + this.bulletStartPosVec[1],
            this.directionVec
        ));
    }

}



