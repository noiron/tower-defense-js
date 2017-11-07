/**
 * 减速场 ====> 就是一个大圆圈
 */

export default class SlowField {
    constructor(opt) {
        const { ctx, parent, range, ratio } = opt;
        this.type = 'slow';
        this.ctx = ctx;

        // range 将随时间逐渐加大
        this.minRange = 20;
        this.maxRange = range;
        this.range = this.minRange;

        this.parent = parent;
        this.ratio = ratio; // 减速系数

        this.maxLife = 300;
        this.life = this.maxLife;

        this.x = parent.x;
        this.y = parent.y;
    }

    draw(ctx) {
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
        const timeStop = 100;   // 在该时间点range达到最大

        const range = minR + Math.min(timeStop, timePassed) * (maxR - minR) / timeStop;
        return range;
    }

}