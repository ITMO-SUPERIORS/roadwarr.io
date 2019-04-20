"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preload_scene_1 = require("./client/scenes/preload-scene");
const menu_scene_1 = require("./client/scenes/menu-scene");
const choose_car_scene_1 = require("./client/scenes/choose-car-scene");
const game_scene_1 = require("./client/scenes/game-scene");
const config = {
    width: 1000,
    height: 600,
    parent: "game",
    scene: [preload_scene_1.PreloadScene, menu_scene_1.MenuScene, choose_car_scene_1.ChooseCarScene, game_scene_1.GameScene],
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
exports.default = config;
//# sourceMappingURL=config.js.map