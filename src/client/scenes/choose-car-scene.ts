/** 
 * @name   game-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game Scene
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

import { Window } from "../../shared/models"
import { PlayerEvent } from "../../shared/events.model";
// declare const window: Window;

export class ChooseCarScene extends Phaser.Scene{
    private title: Phaser.GameObjects.BitmapText[] = [];
    private text: Phaser.GameObjects.BitmapText[] = [];
    private background: Phaser.GameObjects.Image;
    private worldWidth: number;
    private worldHeight: number;
    private carSprite: Phaser.GameObjects.Sprite;
    private carsTex: Phaser.Textures.Texture;
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private startKey: Phaser.Input.Keyboard.Key;
    private currFrame: number;
    private maxFrame: number;
    private flipflop: boolean;

    constructor(){
        super({
            key: "ChooseCarScene"
        });
        // window.socket = io.connect(); 
    }

    init(){
        this.worldWidth = this.sys.canvas.width;
        this.worldHeight = this.sys.canvas.height;
        this.flipflop = false;
        this.currFrame = 0;
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.startKey.isDown = false;
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload(): void{
        this.load.pack(
            "roadwarrioPack",
            "./src/assets/pack.json",
            "roadwarrioPack"
        );
    }

    create(): void{
        this.background = this.add.image(this.worldWidth/2, this.worldHeight/2, "background");
        this.background.setScale(1.8, 1.8);

        this.carsTex = this.textures.get("player_cars");
        this.maxFrame = this.carsTex.frameTotal - 2;
        this.carSprite = this.add.sprite(this.worldWidth / 2, this.worldHeight / 2, "player_cars", this.currFrame);
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
        this.carSprite.angle -= 1;
        this.changeCar();
        if (this.startKey.isDown){
            this.scene.start("GameScene", {frame: this.currFrame});
            // this.waitingForPlayer();
        }
    }

    private changeCar(): void{
        if (this.cursors.right.isDown){
            if(!this.flipflop){
                this.currFrame++;
                if (this.currFrame > this.maxFrame)
                    this.currFrame = 0;
                this.carSprite.setFrame(this.currFrame);
                this.flipflop = true;
            }
        } 
        
        if (this.cursors.left.isDown){
            if(!this.flipflop){
                this.currFrame--;
                if (this.currFrame < 0)
                    this.currFrame = this.maxFrame;
                this.carSprite.setFrame(this.currFrame);
                this.flipflop = true;
            }
        }

        if (this.cursors.left.isUp && this.cursors.right.isUp)
            this.flipflop = false;
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