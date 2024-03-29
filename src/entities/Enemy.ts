import { GRID_SIZE } from '@/constants';
import { index2Px } from '../utils';

/**
 * {
 *   type: 'deceleration',
 *   value: 0.1,
 *   source: someId,
 *   duration: 2000     // ms
 * }
 */
interface BUFF {
  type: string;
  value: number;
  source: number;
  /** ms */
  duration: number;
}

interface Option {
  id: number;
  ctx: CanvasRenderingContext2D;
  /** X 轴当前位置（pixel） */
  x: number;
  /** Y 轴当前位置（pixel） */
  y: number;
  speed: number;
  /** 需要绘制的半径大小 */
  radius: number;
  color: string | 0;
  health: number;
  value?: number;
  damage?: number;

  path: [number, number][];
}

interface Enemy extends Option {
  /** 速度在 x 方向上的分量 */
  vx: number;
  /** 速度在 y 方向上的分量 */
  vy: number;
  /** 当前目标点 waypoint 的 index */
  wp: number;
  dx: number;
  dy: number;
  dist: number;
  angleFlag: 0 | 1;
  maxHealth: number;
  buff: BUFF[];
  angle: number;
  dead: boolean;
  reachDest: boolean;
}

class Enemy implements Option {
  constructor(opt: Option) {
    this.id = opt.id;
    this.ctx = opt.ctx;

    this.x = opt.x;
    this.y = opt.y;
    this.wp = 0;

    this.vx = 0;
    this.vy = 0;

    this.speed = opt.speed || 2;

    // 当前位置到目标点的距离
    this.dx = 0;
    this.dy = 0;
    this.dist = 0;

    this.radius = opt.radius || 10;

    // 标记是否需要转弯
    this.angleFlag = 1;

    this.color = opt.color || 0;
    this.maxHealth = opt.health || 20;
    this.health = this.maxHealth;

    this.value = opt.value || 20;
    this.damage = opt.damage || 5;

    this.path = opt.path;
    this.buff = [];
  }

  step() {
    const path = this.path;
    if (path.length === 0) {
      return;
    }

    // 对 this.buff 中的数据进行依次处理
    let speed = this.speed;
    if (this.buff.length > 0) {
      this.buff.forEach((b, idx) => {
        if (b.type === 'deceleration') {
          // 减速效果
          if (b.duration-- > 0) {
            speed *= 1 - b.value;
          }
        }
        if (b.duration <= 0) {
          this.buff.splice(idx, 1);
        }
      });
    }

    // 当即将达到终点时，path 长度为1，而 this.wp 为1，超出数组范围
    const wp = path[Math.min(this.wp, path.length - 1)];

    const { x: wpX, y: wpY } = index2Px(...wp);
    this.dx = wpX - this.x;
    this.dy = wpY - this.y;
    this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

    if (this.angleFlag) {
      this.angle = Math.atan2(this.dy, this.dx);
      this.angleFlag = 0;
    }
    this.vx = Math.cos(this.angle) * speed;
    this.vy = Math.sin(this.angle) * speed;

    if (Math.abs(this.dist) > speed) {
      this.x += this.vx;
      this.y += this.vy;
    } else {
      const { x, y } = index2Px(...wp);
      this.x = x;
      this.y = y;
      if (this.wp + 1 >= path.length) {
        // 到达终点
        this.dead = true;
        this.reachDest = true;
      } else {
        this.wp++;
        this.angleFlag = 1;
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.strokeStyle = this.color || '#eee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    this.drawHealth();
    // this.drawItsPath();
  }

  drawHealth() {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(this.x - this.radius, this.y);
    ctx.lineTo(
      this.x - this.radius + (this.health / this.maxHealth) * this.radius * 2,
      this.y
    );
    ctx.stroke();
  }

  /**
   * 画出它的前进路径
   */
  drawItsPath() {
    const ctx = this.ctx;
    const path = this.path;
    ctx.strokeStyle = 'greenyellow';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < path.length - 1; i++) {
      ctx.moveTo(
        (path[i][0] + 0.5) * GRID_SIZE,
        (path[i][1] + 0.5) * GRID_SIZE
      );
      if (path[i + 1]) {
        ctx.lineTo(
          (path[i + 1][0] + 0.5) * GRID_SIZE,
          (path[i + 1][1] + 0.5) * GRID_SIZE
        );
      }
    }
    ctx.stroke();
  }
}

export default Enemy;
