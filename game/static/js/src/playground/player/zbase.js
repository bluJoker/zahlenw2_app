class Player extends AcGameObject {
    // x, y: 球中心点坐标; speed:单位高度百分比，避免分辨率不同; is_me:表示是否是自己，自己和非自己的移动方式不同，自己通过鼠标键盘，其他人通过网络传递玩家移动消息
    constructor(playground, x, y, radius, color, speed, is_me) {
	super();
	this.playground = playground;
	this.x = x;
	this.y = y;
	//vx, vy:速度
	this.vx = 0;
	this.vy = 0;
	//move_length:移动距离
	this.move_length = 0;
        this.ctx = this.playground.game_map.ctx;
        this.radius = radius;
	this.color = color;
	this.speed = speed;
	this.is_me = is_me;
	// 精度:浮点运算中小于多少算0
	this.eps = 0.1;
	//当前选择的技能
	this.cur_skill = null;
    }
    
    add_listening_events() {
	let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
	    return false;
	});
	this.playground.game_map.$canvas.mousedown(function(e) {
	    //3:鼠标右键, 1:左键, 2:滚轮
	    if (e.which === 3) {
		outer.move_to(e.clientX, e.clientY);
	    } else if (e.which === 1) {
		if (outer.cur_skill === "fireball") {
		    outer.shoot_fireball(e.clientX, e.clientY);
		}
		outer.cur_skill = null; //点完左键释放掉技能
	    }
	});
	//此处获取键盘的事件不能使用canvas:因为canvas不能聚焦？
        $(window).keydown(function(e) {
	    if (e.which === 81) { //keycode中q键:81
	        outer.cur_skill = "fireball";
		return false;
	    }
	});
    }

    shoot_fireball(tx, ty) {
	//console.log("shoot fireball", tx, ty);
	let x = this.x, y = this.y;
	let radius = this.playground.height * 0.01;
	let angle = Math.atan2(ty - this.y, tx - this.x);
	let vx = Math.cos(angle), vy = Math.sin(angle);
	let color = "orange";
	let speed = this.playground.height * 0.3;
	let move_length = this.playground.height * 1.5;
	new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length);
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
	let dy = y1 - y2;
	return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
	//console.log("move to", tx, ty);
	this.move_length = this.get_dist(this.x, this.y, tx, ty);
	//求角度 反正切
	let angle = Math.atan2(ty - this.y, tx - this.x);
	//vx:横方向速度, vy:纵方向速度
	this.vx = Math.cos(angle);
	this.vy = Math.sin(angle);
    }

    start() {
	if (this.is_me) {
	    this.add_listening_events();
	} else {
	    let tx = Math.random() * this.playground.width;
	    let ty = Math.random() * this.playground.height;
	    this.move_to(tx, ty);	
	}
    }
    update() {
	if (this.move_length < this.eps) {
	    this.move_length = 0;
	    this.vx = this.vy = 0;
	    if (!this.is_me) {
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx, ty);
            }
	} else {
 	    let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
	    this.x += this.vx * moved;
	    this.y += this.vy * moved;
	    this.move_length -= moved;
	}
	this.render();
    }
    render() {
	this.ctx.beginPath();
	this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	//console.log(this.x, this.y, this.radius);
	this.ctx.fillStyle = this.color;
	this.ctx.fill();
    }
}
