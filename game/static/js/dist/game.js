class AcGameMenu {
    constructor(root) { //root: 即web.html中的js:acgame对象
        this.root = root;
	console.log(this);
	console.log(root);    
	this.$menu = $(`
 <div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single">
	    Single
	</div>
	<br>
	<div class="ac-game-menu-field-item ac-game-menu-field-item-multi">
	    Multiple
	</div>
	<br>
	<div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
	    Quit
	</div>
    </div>
</div>
	`);//html对象前加$，普通对象不加$
        this.root.$ac_game.append(this.$menu);
	this.$single = this.$menu.find('.ac-game-menu-field-item-single'); //class前加. id前加#
	this.$multi = this.$menu.find('.ac-game-menu-field-item-multi'); //class前加. id前加#
	this.$settings = this.$menu.find('.ac-game-menu-field-item-settings'); //class前加. id前加#
        
        this.start();
    }
    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single.click(function(){
            outer.hide();
            outer.root.playground.show();
            //console.log("click single");
        });
        this.$multi.click(function(){
            //outer.hide();
            //outer.root.playground.show("multi mode");
	    console.log("click mulit");
        });
        this.$settings.click(function(){
            //outer.root.settings.logout_on_remote();
	    console.log("click quit");
        });

    }
    show() {  // 显示menu界面
        this.$menu.show();
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}
let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔
    }

    start() {  // 只会在第一帧执行一次
    }

    update() {  // 每一帧均会执行一次
    }

    on_destroy() {  // 在被销毁前执行一次
    }

    destroy() {  // 删掉该物体
        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);

class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
	//console.log(playground);
	this.$canvas = $(`<canvas></canvas>`);
	this.ctx = this.$canvas[0].getContext('2d');
	this.ctx.canvas.width = this.playground.width;
	this.ctx.canvas.height = this.playground.height;
	this.playground.$playground.append(this.$canvas); 
    }

    start() {
    }
    update() {
        this.render();
    }

    render() { //渲染
	// choose color first, then draw rectangle
	this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
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
	    }
	});
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
	}
    }
    update() {
	if (this.move_length < this.eps) {
	    this.move_length = 0;
	    this.vx = this.vy = 0;
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
class AcGamePlayground {
    constructor(root) {
        this.root = root;
	console.log(root);
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        //this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
	this.height = this.$playground.height();
	this.game_map = new GameMap(this);
	this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.03, "white", this.height * 0.25, true));
        console.log(this.players);
	console.log(this.game_map);
        this.start();
    }

    start() {
    }

    show() {  // 打开playground界面
        this.$playground.show();
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}

export class AcGame {
    constructor(id) {
        console.log("create zahlenw2 game~");
	console.log(this);
	this.id = id; //传进来的id为div-id
	this.$ac_game = $('#' + id);
        //this.menu = new AcGameMenu(this);
	this.playground = new AcGamePlayground(this);
    }
}

