class AcGameMenu {
    constructor(root) { //root: 即web.html中的js:acgame对象
        this.root = root;
	console.log(this);
	console.log(root);    
	this.$menu = $(`
<!-- TODO:
<div class="ac-game-menu" style="background-image:url(https://img.dota2.com.cn/dota2static/file/e1b72511-af28-4233-839f-4b93e64566f3.jpg)">
    <div class="banner-bg">
        <video class="banner-vidio-bg" preload="preload" muted="true" autoplay="" autobuffer="true" loop="loop" poster="https://img.dota2.com.cn/dota2static/file/e1b72511-af28-4233-839f-4b93e64566f3.jpg">
            <source type="video/webm" src="https://static.pwesports.cn/esportsadmin/DOTA2/primalbeast/video/pb_header_loop.webm">
            <source type="video/mp4" src="https://static.pwesports.cn/esportsadmin/DOTA2/primalbeast/video/pb_header_loop.mp4">
        </video>
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
</div>
-->
 
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