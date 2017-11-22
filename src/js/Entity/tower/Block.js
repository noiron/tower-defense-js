/**
 * 障碍物
 */
import BaseTower from './BaseTower';
import { gridSize } from '../../utils/constant';

export default class Block extends BaseTower {
    constructor(opt) {
        super(opt);
    }

    draw() {
        const ctx = this.ctx;
        
        ctx.save();

        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        const halfSize = gridSize / 2;
        ctx.moveTo(this.x - halfSize, this.y - halfSize);
        ctx.lineTo(this.x + halfSize, this.y + halfSize);
        ctx.moveTo(this.x + halfSize, this.y - halfSize);
        ctx.lineTo(this.x - halfSize, this.y + halfSize);

        ctx.stroke();

        ctx.restore();
    }
}



