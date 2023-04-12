import i18next from 'i18next';

(async function () {
  await i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          Wave: 'Wave',
          Life: 'Life',
          Score: 'Score',
          Money: 'Money',
          CurrentLevel: 'Current Level',
          Attack: 'Attack',
          Pause: 'Pause',
          Resume: 'Resume',
          Upgrade: 'Upgrade',
          Sell: 'Sell',
          TowerInfo: {
            BULLET: 'Bullet Tower',
            LASER: 'Laser Tower',
            SLOW: 'Slow Tower',
            FIRE: 'Fire Tower',
            BLOCK: 'Block',
          },
        },
      },
      ch: {
        translation: {
          Wave: '波',
          Life: '生命',
          Score: '分数',
          Money: '金钱',
          CurrentLevel: '当前等级',
          Attack: '攻击',
          Pause: '暂停',
          Resume: '继续',
          Upgrade: '升级',
          Sell: '出售',
          TowerInfo: {
            BULLET: '子弹塔：沙包大的子弹见过没有？',
            LASER: '激光塔：哎哟，不错！',
            SLOW: '减速塔：Yo, Yo, Yo, 留下来！',
            FIRE: '火焰塔：啊哈，你想被烤成几分熟？',
            BLOCK: '障碍物',
          },
        },
      },
    },
  });
})();

export const WIDTH = 800;
export const HEIGHT = 650;

export const GAME_CONTROL_WIDTH = 230;
export const GAME_CONTROL_HEIGHT = 650;

export const GRID_SIZE = 50;
export const gridWidth = GRID_SIZE;
export const gridHeight = GRID_SIZE;

export const gridNumX = 15; // x轴方向上的格子数目
export const gridNumY = 11; // y轴方向上的格子数目

export const FRAMERATE = 60;

export const OFFSET_X = 25;
export const OFFSET_Y = 50;

interface TowerItem {
  cost: number;
  info: string;
}

interface TowerData {
  BULLET: TowerItem;
  LASER: TowerItem;
  SLOW: TowerItem;
  FIRE: TowerItem;
  BLOCK: TowerItem;
  [index: string]: TowerItem;
}

export const towerData: TowerData = {
  BULLET: {
    cost: 200,
    info: i18next.t('TowerInfo.BULLET'),
  },
  LASER: {
    cost: 200,
    info: i18next.t('TowerInfo.LASER'),
  },
  SLOW: {
    cost: 600,
    info: i18next.t('TowerInfo.SLOW'),
  },
  FIRE: {
    cost: 400,
    info: i18next.t('TowerInfo.FIRE'),
  },
  BLOCK: {
    cost: 50,
    info: i18next.t('TowerInfo.BLOCK'),
  },
};

export const BULLETS = {
  BASE: 'base',
  LINE: 'line',
  CIRCLE: 'circle',
  SLOW: 'slow',
  FIRE: 'fire',
  LASER: 'laser',
};
type BULLET_KEYS = keyof typeof BULLETS;
export type BULLET_TYPE = typeof BULLETS[BULLET_KEYS];
