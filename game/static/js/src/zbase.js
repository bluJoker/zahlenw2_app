export class AcGame {
    constructor(id, AcWingOS) {
        console.log("create zahlenw2 game~");
        console.log(this);
        this.id = id; //传进i来的id为div-id
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS

        this.settings = new Settings(this);    
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
    }
}

