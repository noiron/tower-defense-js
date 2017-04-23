/**
 * 用于发射圆形子弹的塔
 */

import Bullet from './CircleBullet';
import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import { toRadians, calcuteDistance } from '../utils/utils';
import { config } from './../utils/config';
import { towerCost, gridWidth, gridHeight } from './../utils/constant';
import globalId from './../id';


export default class SimpleTower {
    constructor({ ctx, x, y, bullets, selected }) {
        this.x = x;
        this.y = y;
        this.coordX = Math.floor((x - gridWidth / 2) / gridWidth);
        this.coordY = Math.floor((y - gridHeight / 2) / gridHeight);
        this.radius = 12;
        this.hue = 200;
        this.bullets = bullets;
        this.cost = towerCost.simpleTower;
        this.lastShootTime = new Date();
        this.shootInterval = 500;   // 发射间隔，单位ms
        this.direction = 180;     // 用度数表示的tower指向
        this.bulletStartPosVec = vec2.fromValues(0, 0);
        this.directionVec = vec2.create();
        this.targetIndex = -1;
        this.target = null;
        this.targetId = -1;
        this.range = 3.5 * gridWidth;
        this.selected = selected || false;
    }

    draw(ctx) {
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
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
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
        ctx.lineTo(this.x + this.bulletStartPosVec[0], this.y + this.bulletStartPosVec[1]);
        ctx.stroke();
        ctx.closePath();

        if (new Date - this.lastShootTime >= this.shootInterval) {
            this.shoot(ctx);
            this.lastShootTime = new Date();
        }

        // this.direction = (this.direction + 0.6) % 360;

        ctx.restore();
    };

    // 发射子弹
    shoot(ctx) {
        if (this.target) {
            this.bullets.push(new Bullet({
                id: globalId.genId(),
                target: this.target,
                ctx,
                x: this.x + this.bulletStartPosVec[0],
                y: this.y + this.bulletStartPosVec[1],
                range: this.range,
            }
            ));
        }
    }

    findTarget(enemies) {
        // 先判断原有的target是否仍在范围内
        if (this.target !== null) {
            const prevTgt = enemies.getEle(this.target);
            if (prevTgt) {
                if (calcuteDistance(prevTgt.x, prevTgt.y, this.x, this.y) < this.range) {
                    return;
                }
            }
        }

        // 去寻找一个新的target
        this.targetIndex = -1;
        this.targetId = -1;
        this.target = null;

        for (let i = 0, len = enemies.length; i < len; i++) {
            const enemy = enemies[i];
            if (Math.abs(enemy.x - this.x) + Math.abs(enemy.y - this.y) > this.range) {
                // 简化计算
                continue;
            } else {
                if (calcuteDistance(enemy.x, enemy.y, this.x, this.y) < this.range) {
                    if (this.target) this.target.color = 0;
                    this.targetIndex = i;
                    this.target = enemies[i];
                    this.targetId = enemies[i].id;
                    break;
                }
            }
        }

        if (this.targetIndex !== -1) {
            const target = enemies.getEleById(this.targetId);
            if (target) {
                this.directionVec = vec2.fromValues(target.x - this.x, target.y - this.y);
                this.direction = Math.atan2(target.y - this.y, target.x - this.x) * (180 / Math.PI);

                target.color = 'red';
            }
            return target;
        }
    }

}



