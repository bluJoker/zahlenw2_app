// 实现前端与server的wss连接
class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app2672.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }
    start() {
        this.receive();
    }

    receive() {
        let outer = this;

        // 前端接收wss信息
        this.ws.onmessage = function(e) {
            let data = JSON.parse(e.data);
            // console.log(data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) {
                return false;
            }
            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            }
        };
    }

    send_create_player(username, photo) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid, // playground/zbase.js 中的 this.mps.uuid
            'username': username,
            'photo': photo,
            //'message': "hello w2app server",
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

        player.uuid = uuid; // 等于创建的uuid
        this.playground.players.push(player);
    }


}
