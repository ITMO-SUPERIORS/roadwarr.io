export class PreloadScene extends Phaser.Scene{
    private socket: SocketIOClient.Socket | undefined;
    constructor() {
        super({ key: 'PreloadScene'})
    }

    preload(){
        this.load.pack(
            "roadwarrioPack",
            "/assets/pack.json",
            "roadwarrioPack"
        );
    }

    create(){
        this.socket = io.connect();
        this.scene.start("MenuScene",{socket: this.socket} )
    }
}