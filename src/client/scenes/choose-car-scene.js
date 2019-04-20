"use strict";
/**
 * @name   game-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game Scene
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/
Object.defineProperty(exports, "__esModule", { value: true });
// declare const window: Window;
class ChooseCarScene extends Phaser.Scene {
    constructor() {
        super({
            key: "ChooseCarScene"
        });
        this.title = [];
        this.text = [];
        // window.socket = io.connect(); 
    }
    init() {
        this.worldWidth = this.sys.canvas.width;
        this.worldHeight = this.sys.canvas.height;
        this.flipflop = false;
        this.currFrame = 0;
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.startKey.isDown = false;
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    preload() {
        this.load.pack("roadwarrioPack", "./src/assets/pack.json", "roadwarrioPack");
    }
    create() {
        this.background = this.add
            .tileSprite(0, 0, 0, this.worldHeight, "background")
            .setOrigin(0, 0);
        this.background.setScale(1.8, 1.8);
        this.carsTex = this.textures.get("player_cars");
        this.maxFrame = this.carsTex.frameTotal - 2;
        this.carSprite = this.add.sprite(this.worldWidth / 2, this.worldHeight / 2, "player_cars", this.currFrame);
        this.carSprite.setScale(1.5);
        this.title.push(this.add.bitmapText(this.worldWidth / 2 - 300, 100, "game-font", "Choose your car", 40));
        this.text.push(this.add.bitmapText(this.worldWidth / 2 - 200, this.worldHeight / 2 + 150, "game-font", "Press Enter to start", 20));
    }
    update() {
        this.carSprite.angle -= 1;
        this.changeCar();
        if (this.startKey.isDown) {
            this.scene.start("GameScene", { frame: this.currFrame });
            // this.waitingForPlayer();
        }
    }
    changeCar() {
        this.background.tilePositionY -= 4;
        if (this.cursors.right.isDown) {
            if (!this.flipflop) {
                this.currFrame++;
                if (this.currFrame > this.maxFrame)
                    this.currFrame = 0;
                this.carSprite.setFrame(this.currFrame);
                this.flipflop = true;
            }
        }
        if (this.cursors.left.isDown) {
            if (!this.flipflop) {
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
}
exports.ChooseCarScene = ChooseCarScene;
//# sourceMappingURL=choose-car-scene.js.map