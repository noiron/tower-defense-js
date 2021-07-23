import Enemy from './entities/Enemy';
import { BaseTower } from './entities/tower';

/** Bullet 相关类型初始化所需参数 */
export interface IBulletOption {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  target: Enemy;
  range: number;
  damage: number;
  id: number;
  parent: BaseTower;
}
