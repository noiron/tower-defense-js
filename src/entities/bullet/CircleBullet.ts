import { calculateDistance } from '@/utils';
import EntityCollection from '@/EntityCollection';
import Enemy from '../Enemy';
import { BULLETS, BULLET_TYPE } from '@/constants';
import { IBulletOption } from '@/interface';

export default class CircleBullet {
  type: BULLET_TYPE;
  x: number;
  y: number;
  ctx: CanvasRenderingContext2D;
  target: Enemy;
  radius: number;
  speed: number;
  vx: number;
  vy: number;
  angle: number;
  hue: number;
  range: number;
  damage: number;

  constructor({ ctx, x, y, target, range, damage }: IBulletOption) {
    this.type = BULLETS.CIRCLE;
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.target = target;
    this.radius = 3;
    this.speed = 5;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.hue = 200;
    this.range = range;
    this.damage = damage || 5;
  }

  step(enemies: EntityCollection) {
    // 计算新位置

    if (this.target) {
      const target = enemies.getElementById(this.target.id);
      if (target) {
        const curDis = calculateDistance(target.x, target.y, this.x, this.y);
        if (curDis < this.range) {
          const dx = target.x - this.x;
          const dy = target.y - this.y;
          this.angle = Math.atan2(dy, dx);
        }
      }
    }
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D, enemies: EntityCollection) {
    this.step(enemies);

    // 绘图开始
    ctx.save();
    ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, 40%)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }
}
