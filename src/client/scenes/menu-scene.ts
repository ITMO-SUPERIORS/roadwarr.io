/** 
 * @name   menu-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game Scene
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

export class MenuScene extends Phaser.Scene{
    private startKey: Phaser.Input.Keyboard.Key;
    private title: Phaser.GameObjects.BitmapText[] = [];
    private text: Phaser.GameObjects.BitmapText[] = [];
    private background: Phaser.GameObjects.TileSprite;
    private worldWidth: number;
    private worldHeight: number;

    private road: Phaser.GameObjects.TileSprite;
    private roadX: number;
    private roadTex: Phaser.Textures.Texture;
    private roadScale: number;
    private roadWidth: number;

    constructor(){
        super({
            key: "MenuScene"
        });
    }

    init(): void {
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.startKey.isDown = false;
        
        this.roadScale = 2;
        this.worldWidth = this.sys.canvas.width;
        this.worldHeight = this.sys.canvas.height;
    }

    preload(): void {
        this.load.pack(
            "roadwarrioPack",
            "./src/assets/pack.json",
            "roadwarrioPack"
        );
    }

    create(): void {
        this.background = this.add
            .tileSprite(0, 0, 0, this.worldHeight, "background")
            .setOrigin(0, 0);
        this.background.setScale(1.8, 1.8);
    
        this.roadTex = this.textures.get("road");
        this.roadWidth = this.roadTex.getSourceImage().width;
        this.roadX = this.worldWidth / 2 - this.roadWidth;
        this.road = this.add
            .tileSprite(this.roadX, 0, this.roadWidth * this.roadScale, this.worldHeight, "road")
            .setOrigin(0, 0);
        this.road.setTileScale(this.roadScale, this.roadScale);

        this.title.push(
            this.add.bitmapText(
                this.worldWidth / 2 - 320, 
                100,
                "game-font",
                "ROADWARR.IO",
                60
            )
        );

        this.text.push(
            this.add.bitmapText(
                this.worldWidth / 2 - 150,
                this.worldHeight / 2,
                "game-font",
                "ENTER: Start game",
                20
            )
        );
    }

    update(): void {
        this.road.tilePositionY -= 4;
        this.background.tilePositionY -= 4.5;
        if (this.startKey.isDown){
            this.scene.start("ChooseCarScene");
        }
    }
}