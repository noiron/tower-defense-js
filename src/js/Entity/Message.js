// 在画面上显示信息

// 属性：
// 文字内容
// 位置，大小
// 颜色
// type: 提示信息和错误信息需要显示在不同的 canvas 层上 

const canvas = document.getElementById('error-message');
const ctx = canvas.getContext('2d');

class Message {
    constructor(opt) {
        this.text = opt.text;
        this.x = opt.x || 0;
        this.y = opt.y || canvas.height - 15;
        this.width = opt.width || 0;
        this.height = opt.height || 0;

        this.life = 2000;   // 信息存在的时长
        this.startTime = new Date().getTime();  // 信息开始显示的时间

        this.vanish = false;
    }

    draw() {
        if (new Date().getTime() - this.startTime > this.life) {
            this.vanish = true;
        }

        if (this.vanish) {
            return;
        }

        ctx.fillStyle = 'red';
        ctx.font = '20px Arial';

        if (this.text) {
            ctx.fillText(this.text, 50, this.y);
        }
    }
}


export default Message;