import { WIDTH, HEIGHT, GAME_CONTROL_WIDTH } from '../constants';

class GameInfo {
  constructor(opt) {
    this.element = opt.element;
    this.game = opt.game;

    this.element.width = WIDTH + GAME_CONTROL_WIDTH;
    this.element.height = HEIGHT;

    this.infos = [
      {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      },
    ];

    this.count = 0;
  }

  draw() {
    setTimeout(() => this.draw(), 300);

    // 游戏未开始时，不显示提示信息
    if (this.game.status === '') {
      return;
    }

    const infos = this.infos;
    const ctx = this.element.getContext('2d');

    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.clearRect(0, 0, this.element.width, this.element.height);

    infos.forEach((info) => {
      // const rect = [info.x, info.y, info.width, info.height];
      ctx.font = '20px Arial';

      if (info.text && info.text.length > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        // 确定信息显示的位置
        const textStartX = info.x + WIDTH;
        // 确定信息的宽度
        const textWidth = ctx.measureText(info.text).width;
        // 画出信息显示时的背景
        ctx.fillRect(
          textStartX - 20,
          info.y - 25,
          textWidth + 40,
          30 * info.text.length
        );

        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        info.text.forEach((t, idx) => {
          const y = info.y + idx * 25;
          ctx.fillText(t, textStartX, y);
        });

        ctx.restore();
      }
    });
  }
}

export default GameInfo;
