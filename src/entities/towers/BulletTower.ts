import BaseTower from './BaseTower';
import { vec2 } from 'gl-matrix';
import { toRadians } from '@/utils';
import { config } from '@/utils/config';
import { gridWidth, towerData } from '@/constants';
import Enemy from '../Enemy';
import CircleBullet from '../bullets/CircleBullet';
import globalId from '@/id';
import EntityCollection from '@/EntityCollection';

export default class BulletTower extends BaseTower {
  constructor(opt: any) {
    super(opt);

    this.type = 'BULLET';
    this.hue = 200;
    this.cost = towerData[this.type].cost;
    this.range = 3 * gridWidth;

    this.direction = opt.direction || 0; // 用度数表示的tower指向
  }

  draw() {
    const ctx = this.ctx;

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

    // 在选中的情况下，画出其射程范围
    if (this.selected) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
      ctx.fill();
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
    ctx.lineTo(
      this.x + this.bulletStartPosVec[0],
      this.y + this.bulletStartPosVec[1]
    );
    ctx.stroke();
    ctx.closePath();

    if (
      this.targetIndex !== -1 &&
      new Date().getTime() - this.lastShootTime.getTime() >= 500
    ) {
      this.shoot();
      this.lastShootTime = new Date();
    }

    ctx.restore();
  }

  // 发射子弹
  shoot() {
    this.bullets.push(
      new CircleBullet({
        id: globalId.genId(),
        target: this.target,
        ctx: this.ctx,
        x: this.x + this.bulletStartPosVec[0],
        y: this.y + this.bulletStartPosVec[1],
        range: this.range,
        damage: this.damage,
        parent: this,
      })
    );
  }

  findTarget(enemies: EntityCollection<Enemy>) {
    return super.findTarget(enemies);
  }
}
