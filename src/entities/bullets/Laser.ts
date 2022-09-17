import { BULLETS, BULLET_TYPE } from '@/constants';
import { IBulletOption } from '@/interface';
import Enemy from '../Enemy';
import { LaserTower } from '../towers';
import BaseBullet from './BaseBullet';

export default class Laser extends BaseBullet {
  type: BULLET_TYPE;
  id: number;
  x: number;
  y: number;
  ctx: CanvasRenderingContext2D;
  parent: LaserTower;
  target: Enemy;
  damage: number;
  width: number;
  vx: number;
  vy: number;
  angle: number;
  hue: number;

  constructor({
    ctx,
    x,
    y,
    parent,
    target,
    damage,
    id,
  }: Omit<
    IBulletOption & {
      parent: LaserTower;
    },
    'range'
  >) {
    super({ ctx, x, y, parent, damage, id });
    this.type = BULLETS.LASER;
    this.target = target;
    this.width = 5;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.hue = parent.hue;
  }

  step() {
    const parent = this.parent;
    this.x = parent.x + parent.bulletStartPosVec[0];
    this.y = parent.y + parent.bulletStartPosVec[1];
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.step();

    // 绘图开始
    ctx.save();
    ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, 80%)';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.target.x, this.target.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}
