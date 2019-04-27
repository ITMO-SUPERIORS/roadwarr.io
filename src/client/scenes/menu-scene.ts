/** 
 * @name   menu-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game Scene
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/
export class MenuScene extends Phaser.Scene{
    private startKey: Phaser.Input.Keyboard.Key | undefined;
    private title: Phaser.GameObjects.BitmapText[] = [];
    private text: Phaser.GameObjects.BitmapText[] = [];
    private background: Phaser.GameObjects.TileSprite | undefined;
    private worldWidth: number = 0;
    private worldHeight: number = 0;

    private road: Phaser.GameObjects.TileSprite | undefined;
    private roadX: number = 0;
    private roadTex: Phaser.Textures.Texture | undefined;
    private roadScale: number = 1;
    private roadWidth: number = 0;

    constructor(){
        super({
            key: "MenuScene"
        });        
    }

    init(): void {
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.worldWidth = this.game.config.width as number;
        this.worldHeight = this.game.config.height as number;
        
        
        this.roadX = this.worldWidth / 2 - this.roadWidth;
        
        this.startKey.isDown = false;
        
        
        
    }

    preload(): void {
        this.load.pack(
            "roadwarrioPack",
            "/assets/pack.json",
            "roadwarrioPack"
        );
    }

    create(): void {
        this.roadScale = 2;
        this.background = this.add
            .tileSprite(0, 0, 0, this.worldHeight, "background")
            .setOrigin(0, 0);
        this.road = this.add
            .tileSprite(this.roadX, 0, this.roadWidth * this.roadScale, this.worldHeight, "roads")
            .setOrigin(0, 0);
            
        this.background.setScale(1.8, 1.8);
        this.roadTex = this.textures.get("roads");
        this.roadWidth = this.roadTex.getSourceImage().width;
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
        if (this.road)
            this.road.tilePositionY -= 4;
        if (this.background)
            this.background.tilePositionY -= 4.5;

        if (this.startKey && this.startKey.isDown){
            this.scene.start("ChooseCarScene");
        }
    }
}