class AcGameMenu {
    constructor(root) { //root: 即web.html中的js:acgame对象
        this.root = root;
	this.$menu = $(`
	<div class="ac-game-menu"></div>
	`);//html对象前加$，普通对象不加$
	this.root.$ac_game.append(this.$menu);
    }
}
