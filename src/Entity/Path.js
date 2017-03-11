import vec2 from 'gl-matrix/src/gl-matrix/vec2';

var Path = function(ctx) {
    'use strict';

    this.points = [];
    this.radius = 0;

    /**
     * Add a point to path
     */
    this.addPoint = function(x, y) {
        var point = vec2.fromValues(x, y);
        this.points.push(point);
    };

    /**
     * Render path
     */
    this.display = function() {
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#151515';
        ctx.lineWidth = this.radius * 2;
        ctx.fillStyle = "red";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        for (var i= 0; i < this.points.length; i++) {
            ctx.lineTo(this.points[i][0], this.points[i][1]);
        }

        // ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#151515';
        ctx.arc(this.points[0][0], this.points[0][1], this.radius, 0.5*Math.PI, 1.5*Math.PI, false);
        ctx.fill();

        // Draw a line in the middle of the path
        ctx.strokeStyle = '#233333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (i= 0; i < this.points.length; i++) {
            ctx.lineTo(this.points[i][0], this.points[i][1]);
        }
        // ctx.closePath();
        ctx.stroke();

    }
};

export default Path;