import { gridSize } from './../utils/constant';

export default class Enemy {
    constructor(opt) {
        this.id = opt.id;
        this.ctx = opt.ctx;

        // 用像素表示的当前位置
        this.x = opt.x;
        this.y = opt.y;

        // 当前目标点waypoint的index
        this.wp = 1;

        // 速度在两个方向上的分量
        this.vx = 0;
        this.vy = 0;
        
        this.speed = 2;

        // 当前位置到目标点的距离
        this.dx = 0;
        this.dy = 0;
        this.dist = 0;

        // 需要绘制的半径大小
        this.radius = 10;

        // 标记是否需要转弯
        this.angleFlag = 1;

        this.color = 0;
        this.health = 20;
    }


    step({path}) {
        const speed = this.speed;
        const wp = path[this.wp];
        this.dx = (wp[0] * gridSize) + gridSize * 0.5 - this.x;
        this.dy = (wp[1] * gridSize) + gridSize * 0.5 - this.y;
        this.dist = Math.sqrt( this.dx * this.dx + this.dy * this.dy);

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
            this.x = (wp[0] + 0.5) * gridSize;
            this.y = (wp[1] + 0.5) * gridSize;
            if (this.wp + 1 >= path.length) {
                // 到达终点
                console.log('reach destination');
                this.dead = true;
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
    }
} 