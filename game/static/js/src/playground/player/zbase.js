class Player extends AcGameObject {
    // x, y: 球中心点坐标; speed:单位高度百分比，避免分辨率不同; is_me:表示是否是自己，自己和非自己的移动方式不同，自己通过鼠标键盘，其他人通过网络传递玩家移动消息
    constructor(playground, x, y, radius, color, speed, is_me) {
	super();
	this.playground = playground;
	this.x = x;
	this.y = y;
        this.ctx = this.playground.game_map.ctx;
        this.radius = radius;
	this.color = color;
	this.speed = speed;
	this.is_me = is_me;
	// 精度:浮点运算中小于多少算0
	this.eps = 0.1;
    }
    start() {}
    update() {
	this.render();
    }
    render() {
	this.ctx.beginPath();
	this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	console.log(this.x, this.y, this.radius);
	this.ctx.fillStyle = this.color;
	this.ctx.fill();
    }
}
