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
import { PlayerEvent, GameEvent, CoinEvent, RockEvent, CivilEvent } from "../../shared/events.model";
import { Player as PlayerData, Coordinates, Object as ObjectData } from "../../shared/models";

export class GameScene extends Phaser.Scene {
  private civilians : Phaser.GameObjects.Group | undefined;
  private coin: Coin | undefined = undefined;
  private stones: Phaser.GameObjects.Group | undefined;
  private player: Player | undefined;
  private fcivil: CivilCar | undefined;
  private fstone: Stone | undefined;
  private scoreText: Phaser.GameObjects.BitmapText | undefined;
  private background: Phaser.GameObjects.TileSprite | undefined;
  private roadside: number = 0;  
  private road: Phaser.GameObjects.TileSprite | undefined;
  private roadX: number = 0;
  private roadTex: Phaser.Textures.Texture | undefined;
  private roadScale: number = 1;
  private roadWidth: number = 0;
  private carFrame: number = 0;
  private worldWidth: number = 0;
  private worldHeight: number = 0;
  private opponent: Player | undefined;
  private oldPosition: Coordinates | undefined;
  socket: SocketIOClient.Socket | undefined;
  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(data: any): void {
    this.socket = data.socket;
    this.civilians = this.add.group({ classType: CivilCar });
    this.stones = this.add.group({ classType: Stone });
    this.scoreText = this.add
      .bitmapText(30, 50, "font", this.registry.values.score)
      .setDepth(2);   
    this.roadScale = 1.2;
    this.worldWidth = this.game.canvas.width;
    this.worldHeight = this.game.canvas.height;
    this.registry.set("score", 0);
    this.roadside = 40;
    this.carFrame = data.frame;
    
  }

  create(): void {
    this.background = this.add
      .tileSprite(0, 0, 0, this.worldHeight, "background")
      .setOrigin(0, 0);
    this.background.setScale(1.8, 1.8);

    this.roadTex = this.textures.get("roads");
    this.roadWidth = this.roadTex.getSourceImage().width;
    this.roadX = this.worldWidth / 2 - this.roadWidth * this.roadScale / 2;
    this.road = this.add
      .tileSprite(this.roadX, 0, this.roadWidth * this.roadScale, this.worldHeight, "roads")
      .setOrigin(0, 0);

    this.road.setTileScale(this.roadScale, this.roadScale);
    if (this.socket){
      // Передача сообщения, что игра началась
      this.socket.emit(GameEvent.gameStarted, {
        width: this.worldWidth, 
        height: this.worldHeight,
        roadWidth: this.roadWidth,
        roadScale: this.roadScale,
        roadSide: this.roadside });
        
      // Создание игрока
      this.socket.on(PlayerEvent.protagonist, (player: PlayerData) => {
        this.createPlayer(player);
      })
      // Создание оппонента
      this.socket.on(PlayerEvent.opponent, (opponent: PlayerData) =>{
        this.createEnemyPlayer(opponent);
      })
      
      // Создание монетки
      this.socket.on(CoinEvent.create, (coin: ObjectData) => {
        this.addCoin(coin);
      })

      // Создание камня
      this.socket.on(RockEvent.create, (rock: ObjectData) => {
        this.addStone(rock);
      })

      // Создание мирного автомобиля
      this.socket.on(CivilEvent.create, (civil: ObjectData) => {
        this.addCivilCar(civil);
      })
    }  
  }

  update(): void {
    if (this.player && this.road && this.background && this.stones && this.civilians)
      // если игрок жив
      if (!this.player.getDead()){
        this.road.tilePositionY -= 7;
        this.background.tilePositionY -= 4.6;

        this.player.update();

        if (this.socket){            
          // обновление позиции оппонента 
          this.socket.on(PlayerEvent.move, (opponent: PlayerData) => {
            if (this.opponent){
                this.opponent.x = opponent.x;
                this.opponent.y = opponent.y;
            }
          })
        }

        // проверка, на обновление позиции игрока
        let x = this.player.x;
        let y = this.player.y;
        if (this.oldPosition && this.socket && (x != this.oldPosition.x || y != this.oldPosition.y) ){
          // Передача новой позиции игрока на сервер
          this.socket.emit(PlayerEvent.move, {
            x: this.player.x, 
            y: this.player.y, 
            id: this.player.id});
        }
        // сохранение текущей позиции
        this.oldPosition = {
          x: this.player.x,
          y: this.player.y
        }
        
        this.checkPlayerPos();

        // Удаление машин, за пределами экрана
        this.fcivil = this.civilians.getFirstAlive();
        if (this.fcivil && this.fcivil.y > this.worldHeight)
          this.fcivil.destroy();

        // Удаление камней за пределами экрана        
        this.fstone = this.stones.getFirstAlive();
        if (this.fstone && this.fstone.y > this.worldHeight)
          this.fstone.destroy();
        
        
        if (this.coin){
          // удаление монетки за пределами поля
          if (this.coin.y > this.worldHeight)
            this.coinDestroy();

          // Если игрок наехал на монетку
          this.physics.overlap(this.player, this.coin, this.pickupCoin, undefined, this);
          // Если монетка появилась в том же месте, где и мирный, удаляем монетку
          this.physics.overlap(this.coin, this.civilians, this.coinDestroy, undefined, this)    
        }

        // Если игрок столкнулся с мирным автомобилем
        this.physics.overlap(this.player, this.civilians, this.killPlayer, undefined, this);

        // Если игрок столкнулся с камнем
        this.physics.overlap(this.player, this.stones, this.killPlayer, undefined, this);
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
  private addCivilCar(civil: ObjectData): void {
    if (this.civilians)
      this.civilians.add(
        new CivilCar({
          scene: this,
          x: civil.x,
          y: civil.y,
          frame: civil.frame,
          key: "civilians_cars"
        })
      );
  }

  // Добавление камня
  private addStone(stone: ObjectData): void {
    if (this.stones)
      this.stones.add(
        new Stone({
          scene: this,
          x: stone.x,
          y: stone.y,
          frame: stone.frame,
          key: "stones"
      })
    );
  }

  // Создание монетки в сцене
  private addCoin(coin: ObjectData): void{
    if (this.coin == undefined){
      this.coin = new Coin({
        scene: this,
        x: coin.x,
        y: coin.y,
        frame: coin.frame,
        key: "coins"
      })
    }
  }

  // Уничтожение монетки с поля
  private coinDestroy(): void{      
    if (this.socket){
      this.socket.emit(CoinEvent.destroy);
      this.socket.on(CoinEvent.destroy, () => {
        if (this.coin){
          this.coin.destroy();
          this.coin = undefined;
        }
      })
    }
  }

  // когда игрок подобрал монетку
  private pickupCoin(): void{
    if (this.coin && this.scoreText){
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
  
  // Создание игрока
  private createPlayer(data: PlayerData): void{
    this.player = new Player({
      scene: this,
      x: data.x,
      y: data.y,
      key: "player_cars",
      frame: this.carFrame
    },
    data.id);
  }

  // Создание вражеского игрока
  private createEnemyPlayer(data: PlayerData): void{
    this.opponent = new Player({
      scene: this,
      x: data.x,
      y: data.y,
      key: "player_cars",
      frame: 0
    }, data.id)
  }

  // Конец игры
  private game_over(): void{
    if (this.road)
      this.road.tilePositionY = this.road.tilePositionY;
    if (this.coin)
      this.coin.body.setVelocityY(0);
    if (this.stones)
      Phaser.Actions.Call(
        this.stones.getChildren(),
        function(stone){
          stone.body.setVelocityY(0);
      },
      this
      );
    if (this.civilians)
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
