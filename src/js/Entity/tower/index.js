import BaseTower from './BaseTower';
import BulletTower from './BulletTower';
import LaserTower from './LaserTower';
import SlowTower from './SlowTower';
import FireTower from './FireTower';

const TowerFactory = {
    BASE: BaseTower,
    BULLET: BulletTower,
    LASER: LaserTower,
    SLOW: SlowTower,
    FIRE: FireTower,
};

export {
    BaseTower,
    BulletTower,
    LaserTower,
    SlowTower,
    FireTower
};

export default TowerFactory;