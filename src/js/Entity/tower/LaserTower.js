import BaseTower from './BaseTower';
import Laser from '../bullet/Laser';
import { vec2 } from 'gl-matrix';
import { toRadians, calcuteDistance } from '../../utils/utils';
import { config } from './../../utils/config';
import { towerCost, gridWidth, gridHeight } from './../../utils/constant';
import globalId from './../../id';

export default class LaserTower extends BaseTower {
    constructor(opt) {
        const { ctx, x, y, bullets, selected, damage } = opt;
        super(opt);

        this.type = 'LASER';
        this.hue = 60;
        this.cost = towerCost.laserTower;
        this.range = 4 * gridWidth;

        this.direction = opt.direction || 0; // 用度数表示的tower指向
        this.bulletStartPosVec = vec2.fromValues(0, 0);
        this.directionVec = vec2.create();

        this.shooting = false;
        this.damage = 0.1;
    }

    shoot() {
        if (this.target) {
            this.bullets.push(
                new Laser({
                    id: globalId.genId(),
                    target: this.target,
                    ctx: this.ctx,
                    x: this.x + this.bulletStartPosVec[0],
                    y: this.y + this.bulletStartPosVec[1],
                    range: this.range, // 宽度？
                    damage: this.damage,
                    parent: this
                })
            );
        }
    }

    draw() {
        this.step();
        const ctx = this.ctx;

        ctx.save();

        if (config.renderShadow) {
            ctx.shadowBlur = this.radius;
            ctx.shadowColor = 'hsl(' + this.hue + ',100%,60%)';
        }

        // 在选中的情况下，画出其射程范围
        if (this.selected) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
            ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.strokeStyle = 'hsl(' + this.hue + ',100%, 80%';
        ctx.fillStyle = 'hsl(' + this.hue + ',100%, 80%';
        ctx.lineWidth = Math.max(3, this.radius / 8);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.bulletStartPosVec[0], this.y + this.bulletStartPosVec[1]);
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();

        if (this.targetIndex !== -1 && this.shooting === false) {
            this.shoot(ctx);
            this.shooting = true;
        }

        ctx.restore();
    }
}
