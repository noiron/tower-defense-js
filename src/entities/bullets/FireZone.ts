/**
 * 范围伤害 aoe
 */

import { BULLETS } from '@/constants';
import { IBulletOption } from '@/interface';
import { FireTower } from '../towers';

export default class FireZone {
  type: string;
  ctx: CanvasRenderingContext2D;
  id: number;
  minRange: number;
  maxRange: number;
  range: number;
  parent: FireTower;
  damage: number;
  maxLife: number;
  life: number;
  x: number;
  y: number;

  constructor(
    opt: Omit<
      IBulletOption & {
        parent: FireTower;
      },
      'x' | 'y' | 'target'
    >
  ) {
    const { ctx, parent, range, damage, id } = opt;
    this.type = BULLETS.FIRE;
    this.ctx = ctx;
    this.id = id;

    // range 将随时间逐渐加大
    this.minRange = 20;
    this.maxRange = range;
    this.range = this.minRange;

    this.parent = parent;
    this.damage = damage;

    this.maxLife = 300;
    this.life = this.maxLife;

    this.x = parent.x;
    this.y = parent.y;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.life > 0) {
      this.range = this.calcRange();
      ctx.save();
      ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
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
