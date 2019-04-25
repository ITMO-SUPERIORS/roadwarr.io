/** 
 * @name   game-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game Scene
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/


import { CivilCar } from "../objects/civil-car";
import { Player } from "../objects/player";
import { Coin } from "../objects/coin";
import { Stone } from "../objects/stone";

// import { Window } from "../../shared/models"

// declare const window: Window;

export class GameScene extends Phaser.Scene {
  private civilians : Phaser.GameObjects.Group;
  private coin: Coin | undefined;
  private stones: Phaser.GameObjects.Group;
  private player: Player | undefined;
  // private enemyPlayer: Player;
  private fcivil: CivilCar | undefined;
  private fstone: Stone | undefined;
  private scoreText: Phaser.GameObjects.BitmapText;
  private background: Phaser.GameObjects.TileSprite;
  private roadside: number = 0;  
  private road: Phaser.GameObjects.TileSprite;
  private roadX: number = 0;
  private roadTex: Phaser.Textures.Texture;
  private roadScale: number = 0;
  private roadWidth: number = 0;
  private carFrame: number = 0;
  private worldWidth: number = 0;
  private worldHeight: number = 0;
  socket: SocketIOClient.Emitter|undefined;

  constructor() {
    // window.socket = io.connect();
    super({
      key: "GameScene",
    });
    this.road = this.add
      .tileSprite(this.roadX, 0, this.roadWidth * this.roadScale, this.worldHeight, "roads")
      .setOrigin(0, 0);
    this.civilians = this.add.group({ classType: CivilCar });
    this.stones = this.add.group({ classType: Stone });
    this.background = this.add
      .tileSprite(0, 0, 0, this.worldHeight, "background")
      .setOrigin(0, 0);
    this.scoreText = this.add
      .bitmapText(30, 50, "font", this.registry.values.score)
      .setDepth(2);
    this.roadTex = this.textures.get("roads");
  }

  init(data: any): void {
    this.roadScale = 1.2;
    this.worldWidth = this.game.canvas.width;
    this.worldHeight = this.game.canvas.height;
    this.registry.set("score", 0);
    this.roadside = 40;
    this.carFrame = data.frame;
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
    
    this.background.setScale(1.8, 1.8);
    this.roadWidth = this.roadTex.getSourceImage().width;
    this.roadX = this.worldWidth / 2 - this.roadWidth*this.roadScale / 2;
    
    this.road.setTileScale(this.roadScale, this.roadScale);
    
    this.player = new Player({
      scene: this,
      x: this.worldWidth / 2,
      y: this.worldHeight / 2,
      key: "player_cars",
      frame: this.carFrame
    });

    // this.enemyPlayer = new Player({
    //   scene: this,

    // })
    
    

    

    
    
    // Добавление таймера на появление мирных автомобилей
    this.addNewCivilCar();
    this.time.addEvent({ 
      delay: 2200, //ms
      callback: this.addNewCivilCar,
      callbackScope: this,
      loop: true
    });
    
    // Добавление таймера на появление камней на обочине
    this.addNewStoneLeft();
    this.time.addEvent({ 
      delay: 1000, //ms
      callback: this.addNewStoneLeft,
      callbackScope: this,
      loop: true
    });
    
    // Добавление таймера на появление камней на обочине
    this.addNewStoneRight();
    this.time.addEvent({ 
      delay: 1500, //ms
      callback: this.addNewStoneRight,
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
    if (this.player)
      if (!this.player.getDead()){
        this.road.tilePositionY -= 7;
        this.background.tilePositionY -= 5;
        this.player.update();

        this.checkPlayerPos();

        // Удаление машин, которые выехали за пределы сцены
        this.fcivil = this.civilians.getFirstAlive();
        if (this.fcivil)
          if (this.fcivil.y > this.worldHeight)
            this.fcivil.destroy();

        // Удаление камней за пределами сцены
        // this.firstStone = this.stones.getFirstAlive();
        
        this.fstone = this.stones.getFirstAlive();
        if (this.fstone && this.fstone.y > this.worldHeight)
          this.fstone.destroy();
        
        // удаление монетки за пределами поля
        if (this.coin)
          if (this.coin.y > this.worldHeight)
            this.coinDestroy();
        
        // Если игрок наехал на монетку
        
        this.physics.overlap(this.player, this.coin, this.pickupCoin, undefined, this);

        // Если игрок столкнулся с другим автомобилем
        this.physics.overlap(this.player, this.civilians, this.killPlayer, undefined, this);

        // Если игрок столкнулся с камнем
        this.physics.overlap(this.player, this.stones, this.killPlayer, undefined, this);
        if (this.coin)
          this.physics.overlap(this.coin, this.civilians, this.coinDestroy, undefined, this)
        // Если игрок выехал за пределы границ
        this.isOutOfScene();
      }
      else{
        // если игрок мертв
        // запускаем функцию окончания игры
        this.game_over();
      }
  }

  // Назначение игроку состояния мертв
  private killPlayer(): void{
    if (this.player)
      this.player.setDead(true);
  }

  // Добавление мирного автомобиля
  private addNewCivilCar(): void {
    let x = Phaser.Math.Between(this.roadX + this.roadside, this.worldWidth - this.roadX - 80 - this.roadside);
    let carType = Phaser.Math.Between(0, 4);
    this.addCivilCar(x, -150, carType);
  }

  // Добавление левого камня
  private addNewStoneLeft(): void {
    let x = Phaser.Math.Between(0, this.roadX - 100);
    let stoneType = Phaser.Math.Between(0, 3);
    this.addStone(x, -80, stoneType);
  }

  // Добавление правого камня
  private addNewStoneRight(): void {
    let x = Phaser.Math.Between(this.worldWidth - this.roadX, this.worldWidth);
    let stoneType = Phaser.Math.Between(0, 3);
    this.addStone(x, -80, stoneType);
  }

  private addCivilCar(x: number, y: number, frame: number): void {
    this.civilians.add(
      new CivilCar({
        scene: this,
        x: x,
        y: y,
        frame: frame,
        key: "civilians_cars"
      })
    );
  }

  private addStone(x: number, y: number, frame: number): void {
    this.stones.add(
      new Stone({
        scene: this,
        x: x,
        y: y,
        frame: frame,
        key: "stones"
     })
    );
  }

  // добавление монетки в сцену
  private addNewCoin(): void{
    let x = Phaser.Math.Between(this.roadX + this.roadside, this.worldWidth - this.roadX - 80 - this.roadside);
    let range = Phaser.Math.Between(0, 9);
    if (range < 8){
      this.addCoin(x, -80, 1);
    }
    else{
      this.addCoin(x, -80, 0);
    }
  }

  private addCoin(x: number, y: number, frame: number): void{
    if (this.coin == undefined){
      this.coin = new Coin({
        scene: this,
        x: x,
        y: y,
        frame: frame,
        key: "coins"
      })
    }
  }

  private coinDestroy(): void{
    if (this.coin)
      this.coin.destroy();
  }

  // когда игрок подобрал монетку
  private pickupCoin(): void{
    if (this.coin){
      if (this.coin.getFrame())
        this.registry.values.score += 1;
      else
        this.registry.values.score += 5;
      this.scoreText.setText(this.registry.values.score);
      this.coinDestroy();
    }
  }

  // если игрок за пределами границ
  private isOutOfScene(): void{
    if (this.player){
      const { x: posX, y: posY } = this.player.getCenter();
      if (posX < 0 || posY < 0 ||
        posX > this.worldWidth ||
        posY > this.worldHeight)
          this.killPlayer();
    }
  }

  // если игрок за пределами дороги
  private checkPlayerPos(): void{
    if (this.player){
      const { x: posX } = this.player.getCenter();
      let defaultAngle = this.player.rotation;
      if (posX < (this.roadX + this.roadside) || posX > (this.worldWidth - this.roadX - this.roadside)){
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
  
  private game_over(): void{
    this.road.tilePositionY = this.road.tilePositionY;
    if (this.coin){
      this.coin.body.setVelocityY(0);
    }
    
    Phaser.Actions.Call(
      this.stones.getChildren(),
      function(stone){
        stone.body.setVelocityY(0);
     },
     this
    );
    Phaser.Actions.Call(
      this.civilians.getChildren(),
      function(civilCar){
        civilCar.body.setVelocityY(0);
      },
      this
    );
    
    
    this.time.addEvent({ 
      delay: 1000, //ms
      callback: this.backToMenu,
      callbackScope: this,
      loop: false
    });
    
  }

  private backToMenu(): void{
    this.scene.start("MenuScene");
  }
}
