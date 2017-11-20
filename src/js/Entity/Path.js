import { gridWidth, gridHeight } from '../utils/constant';

class Path {
    constructor(opt) {
        this.ctx = opt.ctx;
        this.radius = opt.radius;
        this.orbit = opt.orbit;
        this.points = [];

        /**
         * Add a point to path
         */
        this.addPoint = function(x, y) {
            this.points.push([x, y]);
        };

        // Define path points
        this.setPoints = function() {
            this.orbit.forEach(coord => {
                const [x, y] = coord;
                this.addPoint(gridWidth * (x + 0.5), gridHeight * (y + 0.5));
            });
        };
    }

    /**
     * Render path
     */
    draw() {
        const ctx = this.ctx;
        const PATH_COLOR = '#333';
        ctx.save();

        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.strokeStyle = PATH_COLOR;
        ctx.lineWidth = this.radius * 2;
        ctx.shadowBlur = 0;

        this.points.forEach(point => {
            ctx.lineTo(point[0], point[1]);
        });

        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = PATH_COLOR;
        const startPoint = this.points[0];
        ctx.arc(
            startPoint[0],
            startPoint[1],
            this.radius,
            0 * Math.PI,
            2 * Math.PI,
            false
        );
        ctx.fill();

        // Draw a line in the middle of the path
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.points.forEach(point => {
            ctx.lineTo(point[0], point[1]);
        });
        ctx.stroke();

        ctx.restore();
    }
}

export default Path;
