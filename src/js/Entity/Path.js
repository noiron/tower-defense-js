class Path {
    constructor(opt) {
        this.ctx = opt.ctx;
        this.radius = opt.radius;
        this.pathCoord = opt.pathCoord;
        this.points = [];

        /**
         * Add a point to path
         */
        this.addPoint = function (x, y) {
            this.points.push([x, y]);
        };

        // Define path points
        this.setPoints = function () {
            for (let i = 0, len = this.pathCoord.length; i < len; i++) {
                const coord = this.pathCoord[i];
                this.addPoint(40 * coord[0] + 20, 40 * coord[1] + 20);
            }
        }
    }

    /**
     * Render path
     */
    draw() {
        const ctx = this.ctx;
        ctx.save();

        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = this.radius * 2;
        ctx.shadowBlur = 0;

        for (var i = 0; i < this.points.length; i++) {
            ctx.lineTo(this.points[i][0], this.points[i][1]);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#555';
        ctx.arc(this.points[0][0], this.points[0][1], this.radius, 0.5 * Math.PI, 1.5 * Math.PI, false);
        ctx.fill();

        // Draw a line in the middle of the path
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < this.points.length; i++) {
            ctx.lineTo(this.points[i][0], this.points[i][1]);
        }
        // ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }
};

export default Path;