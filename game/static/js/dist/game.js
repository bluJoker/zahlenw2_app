class AcGameMenu {
    constructor(root) { //root: 即web.html中的js:acgame对象
        this.root = root;
	this.$menu = $(`
	<div class="ac-game-menu"></div>
	`);//html对象前加$，普通对象不加$
	this.root.$ac_game.append(this.$menu);
    }
}
class AcGame {
    constructor(id) {
        console.log("create zahlenw2 game~");
	this.id = id; //传进来的id为div-id
	this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
    }
}

