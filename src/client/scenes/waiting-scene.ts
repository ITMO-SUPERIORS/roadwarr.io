/** 
 * @name   waiting-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game Scene
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

import { GameEvent } from "../../shared/events.model";

export class WaitingScene extends Phaser.Scene{
    private worldWidth: number = 0;
    private worldHeight: number = 0;
    private title: Phaser.GameObjects.BitmapText[] = [];
    private background: Phaser.GameObjects.TileSprite | undefined;
    private carFrame: number = 0;
    socket: SocketIOClient.Socket | undefined;

    constructor(){
        super({
            key: "WaitingScene"
        });
    }

    init(data: any): void{
        this.socket = data.socket;
        this.carFrame = data.frame;
        this.worldWidth = this.sys.canvas.width;
        this.worldHeight = this.sys.canvas.height;
        this.background = this.add
            .tileSprite(0, 0, 0, this.worldHeight, "background")
            .setOrigin(0, 0);
    }

    create(): void{
        if (this.background)
            this.background.setScale(1.8, 1.8);
        this.title.push(
            this.add.bitmapText(
                this.worldWidth / 2 - 330, 
                250,
                "game-font",
                "Waiting for players",
                35
            )
        );
        if (this.socket)
            this.socket.emit(GameEvent.start);
    }

    update(): void{
        if (this.background)
            this.background.tilePositionY -= 4;
        if (this.socket){
            this.socket.on(GameEvent.start, ()=> {
                this.scene.start("GameScene", {frame: this.carFrame, socket: this.socket})
            })
        }
    }
}