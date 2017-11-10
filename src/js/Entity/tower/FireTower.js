/**
 * 范围攻击
 */

import BaseTower from './BaseTower';
import FireZone from '../bullet/FireZone';
import { towerCost, gridWidth, gridHeight } from './../../utils/constant';
import globalId from './../../id';

export default class FireTower extends BaseTower {
    constructor(opt) {
        super(opt);
        const { ctx, x, y, selected, damage } = opt;    

        this.type = 'FIRE';
        this.hue = 0;
        this.cost = towerCost.slowTower;

        this.range = 3 * gridWidth;

        this.shooting = false;
        this.damage = 0.05;

        this.counter = 0;
    }

    shoot() {
        const fireZone = new FireZone({
            id: globalId.genId(),
            ctx: this.ctx,
            range: this.range,
            damage: this.damage,
            parent: this
        });
        this.bullets.push(fireZone);
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        // 在选中的情况下，画出其射程范围
        if (this.selected) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
            ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.strokeStyle = 'hsl(' + this.hue + ',100%, 80%';
        ctx.fillStyle = 'hsl(' + this.hue + ',100%, 80%';
        // ctx.fillStyle = 'rgba(1, 158, 213, 0.3)';
        ctx.lineWidth = Math.max(3, this.radius / 8);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (this.targetIndex !== -1 && !this.shooting) {
            this.shoot();
            this.shooting = true;
        }

        ctx.restore();
    }
}