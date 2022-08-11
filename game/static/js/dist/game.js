class AcGameMenu {
    constructor(root) { //root: 即web.html中的js:acgame对象
        this.root = root;
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
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div>zahlenw2-playground</div>`);

        this.hide();
        this.root.$ac_game.append(this.$playground);

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

class AcGame {
    constructor(id) {
        console.log("create zahlenw2 game~");
	this.id = id; //传进来的id为div-id
	this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
	this.playground = new AcGamePlayground(this);
    }
}

