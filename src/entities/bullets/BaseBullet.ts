import { BULLETS, BULLET_TYPE } from '@/constants';
import { vec2 } from 'gl-matrix';
import { BaseTower } from '../towers';

export default class BaseBullet {
  id: number;
  type: BULLET_TYPE;
  x: number;
  y: number;
  directionVec?: vec2;
  start: vec2;
  hue: number;
  velocity: vec2;
  length: number;
  bulletVec: vec2;
  end: vec2;
  damage: number;
  parent: BaseTower;

  constructor({
    id,
    x,
    y,
    directionVec,
    damage,
    parent,
  }: {
    id: number;
    ctx: CanvasRenderingContext2D;
    x?: number;
    y?: number;
    directionVec?: vec2;
    damage?: number;
    parent: BaseTower;
  }) {
    this.id = id;
    this.type = BULLETS.BASE;
    this.x = x || parent.x;
    this.y = y || parent.y;
    this.directionVec = directionVec;
    this.parent = parent;
    this.hue = 200;
    this.damage = damage || 5;
  }

  // draw(ctx: CanvasRenderingContext2D) {}
}
