/** 
 * @name   game-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

// import { PlayerCar } from "./shared/models";
// import { LoginScene } from "./scenes/login-scene";
// import { Player } from "./objects/player";
import config from "./config";


export default class Game extends Phaser.Game {
  constructor(params: GameConfig) {
    super(params);   
  }
}

window.addEventListener("load", () => {
  new Game(config);
});

