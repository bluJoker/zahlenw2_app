class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app2672.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }
    start() {}

	send_create_player() {
        let outer = this;
        this.ws.send(JSON.stringify({
            //'event': "create_player",
            //'uuid': outer.uuid,
            //'username': username,
            //'photo': photo,
			'message': "hello w2app server",
        }));
    }
	
    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }


}
