/**
 * 减速场 ====> 就是一个大圆圈
 */

import { BULLETS, BULLET_TYPE } from '@/constants';
import { IBulletOption } from '@/interface';
import { SlowTower } from '../towers';
import BaseBullet from './BaseBullet';

export default class SlowField extends BaseBullet {
  type: BULLET_TYPE;
  ctx: CanvasRenderingContext2D;
  id: number;
  minRange: number;
  maxRange: number;
  range: number;
  parent: SlowTower;
  ratio: number;
  life: number;
  maxLife: number;
  x: number;
  y: number;

  constructor(
    opt: IBulletOption & {
      ratio: number;
      parent: SlowTower;
    }
  ) {
    super({ ...opt, damage: 0 });
    const { range, ratio } = opt;
    this.type = BULLETS.SLOW;

    // range 将随时间逐渐加大
    this.minRange = 20;
    this.maxRange = range;
    this.range = this.minRange;

    this.ratio = ratio; // 减速系数

    this.maxLife = 300;
    this.life = this.maxLife;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life > 0) {
      this.range = this.calcRange();
      ctx.save();
      ctx.fillStyle = 'rgba(1, 158, 213, 0.15)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      this.life--;
    }
  }

  /**
   * range 会随时间由最小值逐步加大至最大值，然后保持在最大值
   */
  calcRange() {
    const minR = this.minRange;
    const maxR = this.maxRange;
    const timePassed = this.maxLife - this.life;
    const timeStop = 100; // 在该时间点range达到最大

    const range =
      minR + (Math.min(timeStop, timePassed) * (maxR - minR)) / timeStop;
    return range;
  }
}
