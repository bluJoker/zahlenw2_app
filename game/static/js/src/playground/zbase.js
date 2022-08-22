class AcGamePlayground {
    constructor(root) {
        this.root = root;
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
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height; //其他元素随窗口调整的基准
    
        if (this.game_map) this.game_map.resize();
    }

    show(mode) {  // 打开playground界面
        let outer = this;
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        
        this.resize();
        
        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.04, "white", 0.2, "me", this.root.settings.username, this.root.settings.photo));
        if (mode === "single mode") {
            for (let i = 0; i < 8; i ++ ) {
                this.players.push(new Player(this, this.width / 2 / this.height, 0.5, 0.04, this.get_random_color(), 0.2, "robot"));
            }
        } else if (mode === "multi mode") {
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid; //自己肯定最先加入是0号, 将自己的uuid也带在发送给服务器的信息中，服务器能区分自己和其他玩家

            this.mps.ws.onopen = function() {
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };

        }
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}

