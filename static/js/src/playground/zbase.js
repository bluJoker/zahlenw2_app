class AcGamePlayground {
    constructor(root) {
        this.root = root;
        console.log(root);
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.hide();

        this.root.$ac_game.append(this.$playground);
        this.start();
    }

    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green", "yellow"];
        return colors[Math.floor(Math.random() * 6)];
    }

    start() {
        let outer = this;
        $(window).resize(function() {
            outer.resize();
        });
    }

    resize() {
        console.log("resize");
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height; //其他元素随窗口调整的基准
    
        if (this.game_map) this.game_map.resize();
    }

    show() {  // 打开playground界面
        this.$playground.show();
        this.resize();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.04, "white", 0.2, true));
        for (let i = 0; i < 8; i ++ ) {
            this.players.push(new Player(this, this.width / 2 / this.height, 0.5, 0.04, this.get_random_color(), 0.2, false));
        }

    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}

