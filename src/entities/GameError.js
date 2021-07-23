import { WIDTH, HEIGHT, GAME_CONTROL_WIDTH } from '@/constants';
import EntityCollection from '../EntityCollection';

/**
 * 显示在游戏画面左下角的错误信息
 */
class GameError {
  constructor(opt) {
    this.element = opt.element;
    this.game = opt.game;

    this.element.width = WIDTH + GAME_CONTROL_WIDTH;
    this.element.height = HEIGHT;

    this.messages = new EntityCollection();
  }

  draw() {
    const messages = this.messages;
    const canvas = this.element;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.messages = messages.filter((msg) => !msg.vanish);
    this.messages.forEach((msg, index) => {
      // 不同的消息在 y 方向上叠加
      // TODO: y 方向的数值需要改变
      msg.y = canvas.height - 15 - index * 30;
      msg.draw();
    });

    setTimeout(() => {
      this.draw();
    }, 200);
  }
}

export default GameError;
