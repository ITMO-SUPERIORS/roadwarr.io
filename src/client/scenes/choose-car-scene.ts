/** 
 * @name   game-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game Scene
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

// import { Window } from "../../shared/models"
// import { PlayerEvent } from "../../shared/events.model";
// declare const window: Window;

export class ChooseCarScene extends Phaser.Scene{
    private title: Phaser.GameObjects.BitmapText[] = [];
    private text: Phaser.GameObjects.BitmapText[] = [];
    private background: Phaser.GameObjects.TileSprite | undefined;
    private worldWidth: number = 0;
    private worldHeight: number = 0;
    private carSprite: Phaser.GameObjects.Sprite | undefined;
    private carsTex: Phaser.Textures.Texture | undefined;
    private cursors: Phaser.Input.Keyboard.CursorKeys | undefined;
    private startKey: Phaser.Input.Keyboard.Key | undefined;
    private currFrame: number = 1;
    private maxFrame: number = 0;
    private flipflop: boolean = false;
    // private flipflopEnter: boolean = false;
    socket: SocketIOClient.Socket | undefined;
    constructor(){
        super({
            key: "ChooseCarScene"
        });
    }

    init(data: any): void{
        this.socket = data.socket;
        this.worldWidth = this.sys.canvas.width;
        this.worldHeight = this.sys.canvas.height;
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.cursors = this.input.keyboard.createCursorKeys();
        // window.socket = io.connect(); 

        this.background = this.add
            .tileSprite(0, 0, 0, this.worldHeight, "background")
            .setOrigin(0, 0);
        this.carsTex = this.textures.get("player_cars");
        this.maxFrame = this.carsTex.frameTotal - 2;
        this.carSprite = this.add.sprite(this.worldWidth / 2, this.worldHeight / 2, "player_cars", this.currFrame);
        this.startKey.isDown = false;
    }

    create(): void{
        if (this.background)
            this.background.setScale(1.8, 1.8);
        if (this.carSprite)
            this.carSprite.setScale(1.5);
        this.title.push(
            this.add.bitmapText(
                this.worldWidth / 2 - 300, 
                100,
                "game-font",
                "Choose your car",
                40
            )
        );

        this.text.push(
            this.add.bitmapText(
                this.worldWidth / 2 - 200,
                this.worldHeight / 2 + 150,
                "game-font",
                "Press Enter to start",
                20
            )
        );
    }

    update(): void{
        if (this.background)
            this.background.tilePositionY -= 4;
        if (this.carSprite)
            this.carSprite.angle -= 1;
        this.changeCar();
        if (this.socket && this.startKey && this.startKey.isDown){
            this.scene.start("GameScene", {frame: this.currFrame, socket: this.socket})
        }
        
    }

    private changeCar(): void{
        if (this.carSprite && this.cursors){
            if (this.cursors.right && this.cursors.right.isDown){
                if(!this.flipflop){
                    this.currFrame++;
                    if (this.currFrame > this.maxFrame)
                        this.currFrame = 1;
                        this.carSprite.setFrame(this.currFrame);
                    this.flipflop = true;
                }
            } 
            
            if (this.cursors.left && this.cursors.left.isDown){
                if(!this.flipflop){
                    this.currFrame--;
                    if (this.currFrame < 1)
                        this.currFrame = this.maxFrame;
                    this.carSprite.setFrame(this.currFrame);
                    this.flipflop = true;
                }
            }

            if (this.cursors.left && this.cursors.right && this.cursors.left.isUp && this.cursors.right.isUp)
                this.flipflop = false;
        }
    }

    // ожидание, пока будет готов другой игрок
    // private waitingForPlayer(): void{
    //     this.title.push(
    //         this.add.bitmapText(
    //             this.worldWidth / 2 - 300, 
    //             100,
    //             "game-font",
    //             "Waiting for 2nd player",
    //             40
    //         )
    //     );
    //     window.socket.emit(PlayerEvent.isReady);
    //     window.socket.on(PlayerEvent.isReady, () => {
    //         this.scene.start("GameScene", {frame: this.currFrame});
    //     });
    // }
}