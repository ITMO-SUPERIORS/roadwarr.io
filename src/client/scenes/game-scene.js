"use strict";
/**
 * @name   game-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game Scene
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/
Object.defineProperty(exports, "__esModule", { value: true });
const civil_car_1 = require("../objects/civil-car");
const player_1 = require("../objects/player");
const coin_1 = require("../objects/coin");
const stone_1 = require("../objects/stone");
// declare const window: Window;
class GameScene extends Phaser.Scene {
    constructor() {
        // window.socket = io.connect();
        super({
            key: "GameScene",
        });
    }
    init(data) {
        this.roadScale = 1.2;
        this.worldWidth = this.sys.canvas.width;
        this.worldHeight = this.sys.canvas.height;
        this.registry.set("score", 0);
        this.roadside = 40;
        this.carFrame = data.frame;
    }
    preload() {
        // ассеты
        this.load.pack("roadwarrioPack", "./src/assets/pack.json", "roadwarrioPack");
    }
    create() {
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
        this.player = new player_1.Player({
            scene: this,
            x: this.worldWidth / 2,
            y: this.worldHeight / 2,
            key: "player_cars",
            frame: this.carFrame
        });
        this.enemyPlayer = new player_1.Player({
            scene: this,
        });
        this.scoreText = this.add
            .bitmapText(30, 50, "font", this.registry.values.score)
            .setDepth(2);
        this.civilians = this.add.group({ classType: civil_car_1.CivilCar });
        this.stones = this.add.group({ classType: stone_1.Stone });
        // Добавление таймера на появление мирных автомобилей
        this.addNewCivilCar();
        this.time.addEvent({
            delay: 2200,
            callback: this.addNewCivilCar,
            callbackScope: this,
            loop: true
        });
        // Добавление таймера на появление камней на обочине
        this.addNewStoneLeft();
        this.time.addEvent({
            delay: 1000,
            callback: this.addNewStoneLeft,
            callbackScope: this,
            loop: true
        });
        // Добавление таймера на появление камней на обочине
        this.addNewStoneRight();
        this.time.addEvent({
            delay: 1500,
            callback: this.addNewStoneRight,
            callbackScope: this,
            loop: true
        });
        // добавление таймера на появление монеток
        this.addNewCoin();
        this.time.addEvent({
            delay: 5000,
            callback: this.addNewCoin,
            callbackScope: this,
            loop: true
        });
    }
    update() {
        // если игрок жив
        if (!this.player.getDead()) {
            this.road.tilePositionY -= 7;
            this.background.tilePositionY -= 5;
            this.player.update();
            this.checkPlayerPos();
            // Удаление машин, которые выехали за пределы сцены
            this.fcivil = this.civilians.getFirstAlive();
            if (this.fcivil.y > this.worldHeight)
                this.fcivil.destroy();
            // Удаление камней за пределами сцены
            // this.firstStone = this.stones.getFirstAlive();
            this.fstone = this.stones.getFirstAlive();
            if (this.fstone.y > this.worldHeight)
                this.fstone.destroy();
            // удаление монетки за пределами поля
            if (this.coin.y > this.worldHeight)
                this.coinDestroy();
            // Если игрок наехал на монетку
            this.physics.overlap(this.player, this.coin, this.pickupCoin, null, this);
            // Если игрок столкнулся с другим автомобилем
            this.physics.overlap(this.player, this.civilians, this.killPlayer, null, this);
            // Если игрок столкнулся с камнем
            this.physics.overlap(this.player, this.stones, this.killPlayer, null, this);
            this.physics.overlap(this.coin, this.civilians, this.coinDestroy, null, this);
            // Если игрок выехал за пределы границ
            this.isOutOfScene();
        }
        else {
            // если игрок мертв
            // запускаем функцию окончания игры
            this.game_over();
        }
    }
    // Назначение игроку состояния мертв
    killPlayer() {
        this.player.setDead(true);
    }
    // Добавление мирного автомобиля
    addNewCivilCar() {
        let x = Phaser.Math.Between(this.roadX + this.roadside, this.worldWidth - this.roadX - this.player.width - this.roadside);
        let carType = Phaser.Math.Between(0, 4);
        this.addCivilCar(x, -150, carType);
    }
    // Добавление левого камня
    addNewStoneLeft() {
        let x = Phaser.Math.Between(0, this.roadX - 100);
        let stoneType = Phaser.Math.Between(0, 3);
        this.addStone(x, -80, stoneType);
    }
    // Добавление правого камня
    addNewStoneRight() {
        let x = Phaser.Math.Between(this.worldWidth - this.roadX, this.worldWidth);
        let stoneType = Phaser.Math.Between(0, 3);
        this.addStone(x, -80, stoneType);
    }
    addCivilCar(x, y, frame) {
        this.civilians.add(new civil_car_1.CivilCar({
            scene: this,
            x: x,
            y: y,
            frame: frame,
            key: "civilians_cars"
        }));
    }
    addStone(x, y, frame) {
        this.stones.add(new stone_1.Stone({
            scene: this,
            x: x,
            y: y,
            frame: frame,
            key: "stones"
        }));
    }
    // добавление монетки в сцену
    addNewCoin() {
        let x = Phaser.Math.Between(this.roadX + this.roadside, this.worldWidth - this.roadX - 80 - this.roadside);
        let range = Phaser.Math.Between(0, 9);
        if (range < 8) {
            this.addCoin(x, -80, 1);
        }
        else {
            this.addCoin(x, -80, 0);
        }
        this.hasCoin = true;
    }
    addCoin(x, y, frame) {
        this.coin = new coin_1.Coin({
            scene: this,
            x: x,
            y: y,
            frame: frame,
            key: "coins"
        });
    }
    coinDestroy() {
        this.coin.destroy();
        this.hasCoin = false;
    }
    // когда игрок подобрал монетку
    pickupCoin() {
        if (this.coin.getFrame()) {
            this.registry.values.score += 1;
        }
        else {
            this.registry.values.score += 5;
        }
        this.scoreText.setText(this.registry.values.score);
        this.coinDestroy();
    }
    // если игрок за пределами границ
    isOutOfScene() {
        const { x: posX, y: posY } = this.player.getCenter();
        if (posX < 0 || posY < 0 ||
            posX > this.worldWidth ||
            posY > this.worldHeight)
            this.killPlayer();
    }
    // если игрок за пределами дороги
    checkPlayerPos() {
        const { x: posX } = this.player.getCenter();
        let defaultAngle = this.player.rotation;
        if (posX < (this.roadX + this.roadside) || posX > (this.worldWidth - this.roadX - this.roadside)) {
            let rotate = Phaser.Math.Between(defaultAngle - 5, defaultAngle + 5);
            this.player.body.setVelocityY(250);
            this.player.setAngle(rotate);
        }
        else {
            this.player.body.setVelocityY(0);
            this.player.setAngle(defaultAngle);
        }
    }
    game_over() {
        this.road.tilePositionY = this.road.tilePositionY;
        if (this.hasCoin == true) {
            this.coin.body.setVelocityY(0);
        }
        Phaser.Actions.Call(this.stones.getChildren(), function (stone) {
            stone.body.setVelocityY(0);
        }, this);
        Phaser.Actions.Call(this.civilians.getChildren(), function (civilCar) {
            civilCar.body.setVelocityY(0);
        }, this);
        this.time.addEvent({
            delay: 1000,
            callback: this.backToMenu,
            callbackScope: this,
            loop: false
        });
    }
    backToMenu() {
        this.scene.start("MenuScene");
    }
}
exports.GameScene = GameScene;
//# sourceMappingURL=game-scene.js.map