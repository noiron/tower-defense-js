import { GRID_SIZE } from '../utils/constant';
import { index2Px } from '../utils';

class Path {
  constructor(opt) {
    this.ctx = opt.ctx;
    this.radius = opt.radius || GRID_SIZE / 2;
    this.orbit = opt.orbit;
    this.points = [];
  }

  /**
   * Add a point to path
   */
  addPoint(x, y) {
    this.points.push([x, y]);
  }

  // Define path points
  setPoints() {
    this.orbit.forEach((coord) => {
      const { x, y } = index2Px(...coord);
      this.addPoint(x, y);
    });
  }

  /**
   * Render path
   */
  draw() {
    if (this.points.length === 0) {
      return;
    }
    const ctx = this.ctx;
    const PATH_COLOR = '#333';
    ctx.save();

    ctx.beginPath();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = PATH_COLOR;
    ctx.lineWidth = (this.radius - 1) * 2;
    ctx.shadowBlur = 0;

    this.points.forEach((point) => {
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
    this.points.forEach((point) => {
      ctx.lineTo(point[0], point[1]);
    });
    ctx.stroke();

    // 标记终点
    ctx.beginPath();
    ctx.fillStyle = 'tomato';
    const endPoint = this.points[this.points.length - 1];
    ctx.arc(
      endPoint[0],
      endPoint[1],
      this.radius * 0.6,
      0 * Math.PI,
      2 * Math.PI,
      false
    );
    ctx.fill();

    ctx.restore();
  }
}

export default Path;
