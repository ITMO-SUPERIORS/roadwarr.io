import io from 'socket.io-client';
export class PreloadScene extends Phaser.Scene{
    constructor() {
        super({ key: 'PreloadScene'})
    }

    create(){
        let socket = io.connect() as SocketIOClient.Socket
        socket.on('connect', () => {
            console.log("You're connected to socket.io")
        })

        socket.on("gotoMenu", () =>{
            this.scene.start('MenuScene');
        })
    }
}