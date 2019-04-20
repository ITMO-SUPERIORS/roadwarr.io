import { PreloadScene} from "./scenes/preload-scene"
import { MenuScene } from "./scenes/menu-scene";
import { ChooseCarScene } from "./scenes/choose-car-scene";
import { GameScene } from "./scenes/game-scene";

const config: GameConfig = {
    width: 1000,
    height: 600,
    parent: "game",
    scene: [PreloadScene, MenuScene, ChooseCarScene, GameScene],
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

  export default config