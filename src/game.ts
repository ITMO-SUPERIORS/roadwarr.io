/** 
 * @name   game-scene.ts
 * @author Bastarda
 * @description roadwarr.io: Game
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

import "phaser";
import { MenuScene } from "./scenes/menu-scene";
import { GameScene } from "./scenes/game-scene";

const config: GameConfig = {
  width: 800,
  height: 600,
  parent: "game",
  scene: [MenuScene, GameScene],
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
  constructor(config: GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  let game = new Game(config);
});
