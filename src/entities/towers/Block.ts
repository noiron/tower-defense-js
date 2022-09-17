/**
 * 障碍物
 */
import BaseTower from './BaseTower';
import { GRID_SIZE } from '@/constants';

export default class Block extends BaseTower {
  constructor(opt: any) {
    super(opt);
    this.type = 'BLOCK';
  }

  draw() {
    const ctx = this.ctx;

    ctx.save();

    ctx.strokeStyle = 'greenyellow';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const halfSize = GRID_SIZE / 2;
    ctx.moveTo(this.x - halfSize, this.y - halfSize);
    ctx.lineTo(this.x + halfSize, this.y + halfSize);
    ctx.moveTo(this.x + halfSize, this.y - halfSize);
    ctx.lineTo(this.x - halfSize, this.y + halfSize);

    ctx.stroke();

    ctx.restore();
  }
}
