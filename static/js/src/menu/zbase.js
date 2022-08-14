class AcGameMenu {
    constructor(root) { //root: 即web.html中的js:acgame对象
        this.root = root;
	console.log(this);
	console.log(root);    
	this.$menu = $(`
 <div class="ac-game-menu">
    <div class="banner-middle">
        <h4>一款现代多人游戏杰作-《DESTRUCTOID》</h4>
    </div>
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single">
	    单人模式
	</div>
	<br>
	<div class="ac-game-menu-field-item ac-game-menu-field-item-multi">
	    多人模式
	</div>
	<br>
	<div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
	    退出
	</div>
    </div>
</div>
	`);//html对象前加$，普通对象不加$
        this.$menu.hide();
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
