/** 
 * @name   game-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game Scene
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/


import {CivilCar} from "../objects/civil-car";
import { Player } from "../objects/player";
import { Coin } from "../objects/coin";

export class GameScene extends Phaser.Scene {
  private civilians : Phaser.GameObjects.Group;
  private coin: Coin;
  private player: Player;
  private fcivil: CivilCar;
  private scoreText: Phaser.GameObjects.BitmapText;
  
  private road: Phaser.GameObjects.TileSprite;
  private roadX: number;
  private roadTex: Phaser.Textures.Texture;
  private roadScale: number;
  private roadWidth: number;

  private worldWidth: number;
  private worldHeight: number;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(): void {
    this.roadScale = 2;
    this.worldWidth = this.sys.canvas.width;
    this.worldHeight = this.sys.canvas.height;
    this.registry.set("score", 0);
  }

  preload(): void {
    // ассеты
    this.load.pack(
      "roadwarrioPack",
      "./src/assets/pack.json",
      "roadwarrioPack"
    )
  }

  create(): void {
    this.roadTex = this.textures.get("road");
    this.roadWidth = this.roadTex.getSourceImage().width;
    this.roadX = this.worldWidth / 2 - this.roadWidth;
    this.road = this.add
      .tileSprite(this.roadX, 0, this.roadWidth * this.roadScale, this.worldHeight, "road")
      .setOrigin(0, 0);
    this.road.setTileScale(this.roadScale, this.roadScale);

    this.player = new Player({
      scene: this,
      x: this.worldWidth / 2,
      y: this.worldHeight / 2,
      key: "player"
    });

    this.scoreText = this.add
      .bitmapText(30, 50, "font", this.registry.values.score)
      .setDepth(2);

    this.civilians = this.add.group({ classType: CivilCar });
    
    // Добавление таймера на появление мирных автомобилей
    this.addNewCivilCar();
    this.time.addEvent({ 
      delay: 1500, //ms
      callback: this.addNewCivilCar,
      callbackScope: this,
      loop: true
    });

    // добавление таймера на появление монеток
    this.addNewCoin();
    this.time.addEvent({ 
      delay: 5000, //ms
      callback: this.addNewCoin,
      callbackScope: this,
      loop: true
    });

  }

  update(): void {
    // если игрок жив
    if (!this.player.getDead()){
      this.road.tilePositionY -= 4;  
      this.player.update();

      this.checkPlayerPos();

      // Удаление машин, которые выехали за пределы сцены
      this.fcivil = this.civilians.getFirstAlive();
      if (this.fcivil.y > this.worldHeight)
        this.fcivil.destroy();
      
      // удаление монетки за пределами поля
      if (this.coin.y > this.worldHeight)
        this.coin.destroy();

      // Если игрок наехал на монетку
      this.physics.overlap(this.player, this.coin, this.pickupCoin, null, this);

      // Если игрок столкнулся с другим автомобилем
      this.physics.overlap(this.player, this.civilians, this.killPlayer, null, this);

      this.physics.overlap(this.coin, this.civilians, this.respawnCoin, null, this)
      // Если игрок выехал за пределы границ
      this.isOutOfScene();
    }
    else{
      // Если состояние игрока - мертв, то перезапускаем сцену
      this.scene.restart();
    }
  }

  // Назначение игроку состояния мертв
  private killPlayer(): void{
    this.player.setDead(true);
  }

  // Добавление мирного автомобиля
  private addNewCivilCar(): void {
    let x = Phaser.Math.Between(this.roadX, this.worldWidth - this.roadX - this.player.width);
    this.addCivilCar(x, -80);
  }

  private addCivilCar(x: number, y: number): void {
    this.civilians.add(
      new CivilCar({
        scene: this,
        x: x,
        y: y,
        key: "civilian"
      })
    );
  }

  // добавление монетки в сцену
  private addNewCoin(): void{
    let x = Phaser.Math.Between(this.roadX, this.worldWidth - this.roadX - 80);
    let range = Phaser.Math.Between(0, 9);
    if (range < 8){
      this.addCoin(x, -80, 1);
    }
    else{
      this.addCoin(x, -80, 0);
    }
  }

  private addCoin(x: number, y: number, frame: number): void{
    this.coin = new Coin({
      scene: this,
      x: x,
      y: y,
      frame: frame,
      key: "coins"
    })
  }

  private respawnCoin(): void{
    this.coin.destroy();
    this.addNewCoin();
  }
  // когда игрок подобрал монетку
  private pickupCoin(): void{
    if (this.coin.getFrame()){
      this.registry.values.score += 1;
      
    }
    else{
      this.registry.values.score += 5;
    }
    this.scoreText.setText(this.registry.values.score);
    this.coin.destroy();
  }

  // если игрок за пределами границ
  private isOutOfScene(): void{
    const { x: posX, y: posY } = this.player.getCenter();
    if (posX < 0 || posY < 0 ||
        posX > this.worldWidth ||
        posY > this.worldHeight)
        this.killPlayer();
  }

  // если игрок за пределами дороги
  private checkPlayerPos(): void{
    const { x: posX } = this.player.getCenter();
    let defaultAngle = this.player.rotation;
    if (posX < this.roadX || posX > (this.worldWidth - this.roadX)){
      let rotate = Phaser.Math.Between(defaultAngle - 5, defaultAngle + 5);
      this.player.body.setVelocityY(250);
      this.player.setAngle(rotate);
    }
    else{
      this.player.body.setVelocityY(0);
      this.player.setAngle(defaultAngle);
    }
  }

}
