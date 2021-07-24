import { BULLETS, BULLET_TYPE } from '@/constants';
import { IBulletOption } from '@/interface';
import Enemy from '../Enemy';
import { LaserTower } from '../towers';

export default class Laser {
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
    this.type = BULLETS.LASER;
    this.id = id;
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.target = target;
    this.width = 5;
    // this.speed = 8;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.hue = parent.hue;
    this.damage = damage || 5;
    this.parent = parent;
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
