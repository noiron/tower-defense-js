import { WIDTH, HEIGHT, GAME_CONTROL_WIDTH } from '../utils/constant';

class GameInfo {
    constructor(opt) {
        this.element = opt.element;
        this.game = opt.game;

        this.element.width = WIDTH + GAME_CONTROL_WIDTH;
        this.element.height = HEIGHT;

        this.infos = [{
            x: 100,
            y: 100,
            width: 100,
            height: 100,
        }];

        this.count = 0;
    }

    draw() {
        const infos = this.infos;
        const ctx = this.element.getContext('2d');
    
        ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        ctx.clearRect(0, 0, this.element.width, this.element.height);

        infos.forEach(info => {
            const rect = [info.x, info.y, info.width, info.height];
            ctx.font = '20px Arial';

            if (info.text) {
                ctx.save();
                ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
                // 确定信息显示的位置
                const textStartX = info.x + WIDTH;
                // 确定信息的宽度
                const textWidth = ctx.measureText(info.text).width;
                // 画出信息显示时的背景
                ctx.fillRect(textStartX - 20, info.y - 50, textWidth + 40, 60);
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillText(info.text, textStartX, info.y);

                ctx.restore();
            }
        });
        // console.log(this.count++);
        // requestAnimationFrame(() => this.draw());
        setTimeout(() => this.draw(), 300);
    }
}


export default GameInfo;