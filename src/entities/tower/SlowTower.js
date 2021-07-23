/**
 * 减速塔
 */

import BaseTower from './BaseTower';
import SlowField from '../bullets/SlowField';
import { towerData, gridWidth } from '@/constants';
import globalId from '../../id';

export default class SlowTower extends BaseTower {
  constructor(opt) {
    super(opt);
    // const { ctx, x, y, selected, damage } = opt;

    this.type = 'SLOW';
    this.hue = 120;
    this.cost = towerData[this.type].cost;

    this.range = 2.5 * gridWidth;

    this.shooting = false;
    this.ratio = 0.3;

    this.counter = 0;
  }

  shoot() {
    const slowField = new SlowField({
      id: globalId.genId(),
      ctx: this.ctx,
      range: this.range,
      ratio: this.ratio,
      parent: this,
    });
    this.bullets.push(slowField);
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
    // ctx.fillStyle = 'hsl(' + this.hue + ',100%, 80%';
    ctx.fillStyle = 'rgba(1, 158, 213, 0.15)';
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
