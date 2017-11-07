import BaseTower from './BaseTower';
import BulletTower from './BulletTower';
import LaserTower from './LaserTower';

const TowerFactory = {
    BASE: BaseTower,
    BULLET: BulletTower,
    LASER: LaserTower,
};

export {
    BaseTower,
    BulletTower,
    LaserTower,
};

export default TowerFactory;