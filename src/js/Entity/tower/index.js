import BaseTower from './BaseTower';
import BulletTower from './BulletTower';
import LaserTower from './LaserTower';
import SlowTower from './SlowTower';

const TowerFactory = {
    BASE: BaseTower,
    BULLET: BulletTower,
    LASER: LaserTower,
    SLOW: SlowTower,
};

export {
    BaseTower,
    BulletTower,
    LaserTower,
    SlowTower,
};

export default TowerFactory;