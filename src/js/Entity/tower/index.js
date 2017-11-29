import BaseTower from './BaseTower';
import BulletTower from './BulletTower';
import LaserTower from './LaserTower';
import SlowTower from './SlowTower';
import FireTower from './FireTower';
import Block from './Block';

const TowerFactory = {
    BASE: BaseTower,
    BULLET: BulletTower,
    LASER: LaserTower,
    SLOW: SlowTower,
    FIRE: FireTower,
    BLOCK: Block
};

export {
    BaseTower,
    BulletTower,
    LaserTower,
    SlowTower,
    FireTower,
    Block
};

export default TowerFactory;