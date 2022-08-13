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
class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 1;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
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
        //被击中伤害后的速度等参数
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;

	//move_length:移动距离
	this.move_length = 0;
        this.ctx = this.playground.game_map.ctx;
        this.radius = radius;
	this.color = color;
	this.speed = speed;
	this.is_me = is_me;
	// 精度:浮点运算中小于多少算0
	this.eps = 0.1;
        //被击中后的摩擦力
        this.friction = 0.9;
        this.spent_time = 0;

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
	new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.005);
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

    is_attacked(angle, damage) {
        for (let i = 0; i < 20 + Math.random() * 10; i ++ ) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        
        //玩家血量[半径]减去伤害值
	this.radius -= damage;
        if (this.radius < 5) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 45;
	//血量减少，但速度变快
	this.speed *= 1.25;
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
	//单机模式中其他玩家随机攻击
	this.spent_time += this.timedelta / 1000;
	if (!this.is_me && this.spent_time > 4 && Math.random() < 1 / 300.0) {
	    let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            this.shoot_fireball(tx, ty);
	}
	//伤害消失。10表示被撞后速度<=10就不管它了，让其再次随机运动。
        if (this.damage_speed > 10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else { //如果处于被攻击状态，伤害速度没有降为0。else关键字表示此时失去键盘控制[描述有误，其他玩家不受键盘控制，此处else只是说不在处于随机运动状态]。
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
class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
	super();
	this.playground = playground;
	this.player = player;
	this.ctx = this.playground.game_map.ctx;
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.radius = radius;
	this.color = color;
	this.speed = speed;
	//射程
	this.move_length = move_length;
        this.damage = damage;
	this.eps = 0.1;
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }


    start() {}
    update() {
	if (this.move_length < this.eps) {
	    this.destroy();
	    return false;
	}
	let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
	this.x += this.vx * moved;
	this.y += this.vy * moved;
	this.move_length -= moved;

	//每帧去遍历所有其他玩家，检查是否与本火球碰撞了
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }

	this.render();
    }
    render() {
        this.ctx.beginPath();
	this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
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
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.035, "white", this.height * 0.2, true));
	for (let i = 0; i < 5; i ++ ) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.035, this.get_random_color(), this.height * 0.2, false));
        }
        
	this.start();
    }

    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green", "yellow"];
        return colors[Math.floor(Math.random() * 6)];
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

