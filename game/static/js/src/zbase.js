export class AcGame {
    constructor(id) {
        console.log("create zahlenw2 game~");
	console.log(this);
	this.id = id; //传进来的id为div-id
	this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
	this.playground = new AcGamePlayground(this);
    }
}

