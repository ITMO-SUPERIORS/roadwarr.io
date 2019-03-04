/** 
 * @name   game-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game Scene
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/


import {CivilCar} from "../objects/civil-car";
import { Player } from "../objects/player";

export class GameScene extends Phaser.Scene {
  private civilians : Phaser.GameObjects.Group;
  private player: Player;
  private road: Phaser.GameObjects.TileSprite;
  private roadImage: Phaser.GameObjects.Image;
  private roadWidth: number;
  private roadX: number;
  private fcivil: CivilCar;
  // private scoreText: Phaser.GameObjects.BitmapText;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(): void {
    
  }

  preload(): void {
    this.load.path = "./src/assets/images/",
    this.load.image("player", "car.png");
    this.load.image("road", "road.png");
    this.load.image("civilian", "civil_car.png");
  }

  create(): void {
    this.roadImage = this.add.image(0,0,"road");
    this.roadWidth = this.roadImage.width;
    this.roadImage.destroy();
    this.roadX = this.sys.canvas.width / 2 - this.roadWidth;
    this.road = this.add
      .tileSprite(this.roadX, 0, this.roadWidth*2, this.sys.canvas.height, "road")
      .setOrigin(0, 0);
    this.road.setTileScale(2, 2);

    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      key: "player"
    });
    // this.scoreText = this.add
    //   .bitmapText(
    //     this.sys.canvas.width / 2 - 14,
    //     30,
    //     "font",
    //     this.registry.values.score
    //   )
    //   .setDepth(2);

    this.civilians = this.add.group({ classType: CivilCar });

    this.addNewCivilCar();

    // Добавление таймера 
    this.time.addEvent({
      delay: 1500, //ms
      callback: this.addNewCivilCar,
      callbackScope: this,
      loop: true
    });
  }

  update(): void {
    
    // если игрок жив
    if (!this.player.getDead()){
      this.road.tilePositionY -= 4;  
      this.player.update();

      // Удаление машин, которые выехали за пределы сцены
      this.fcivil = this.civilians.getFirst(true);
      if (this.fcivil.y > this.sys.canvas.height){
        this.fcivil.destroy();
      }

      // Если игрок столкнулся с другим автомобилем
      this.physics.overlap(this.player, this.civilians, this.killPlayer, null, this);
    }
    else{
      // Если состояние игрока - мертв, то перезапускаем сцену
      this.scene.restart();
    }
  }

  private killPlayer(): void{
    // Назначение игроку состояния: мертв
    this.player.setDead(true);
  }

  private addNewCivilCar(): void {
    // Добавление мирного автомобиля

    // update the score
    // this.registry.values.score += 1;
    // this.scoreText.setText(this.registry.values.score);
    let x = Phaser.Math.Between(this.roadX, this.sys.canvas.width - this.roadX - this.player.width);
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
}
