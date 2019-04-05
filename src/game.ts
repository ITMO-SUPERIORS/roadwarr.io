/** 
 * @name   game-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

import "phaser";
import { MenuScene } from "./client/scenes/menu-scene";
import { ChooseCarScene } from "./client/scenes/choose-car-scene";
import { GameScene } from "./client/scenes/game-scene";
// import { PlayerCar } from "./shared/models";
import { LoginScene } from "./client/scenes/login-scene";
// import { Player } from "./objects/player";

const config: GameConfig = {
  width: 1000,
  height: 600,
  parent: "game",
  scene: [MenuScene, ChooseCarScene, GameScene],
  input: {
    keyboard: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  render: { pixelArt: true }
};

export class Game extends Phaser.Game {
  public login: LoginScene;
  public menu: MenuScene;
  constructor(config: GameConfig) {
    super(config);
    this.login = new LoginScene();
    
  }

}

window.addEventListener("load", () => {
  let game = new Game(config);
});

