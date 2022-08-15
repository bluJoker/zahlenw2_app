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