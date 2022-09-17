import Enemy from './entities/Enemy';
import { BaseTower } from './entities/towers';

/** Bullet 相关类型初始化所需参数 */
export interface IBulletOption {
  id: number;
  ctx: CanvasRenderingContext2D;
  x?: number;
  y?: number;
  target?: Enemy;
  range: number;
  damage?: number;
  parent: BaseTower;
}
