"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }
    create() {
        let socket = socket_io_client_1.default.connect();
        socket.on('connect', () => {
            console.log("You're connected to socket.io");
        });
        socket.on("gotoMenu", () => {
            this.scene.start('MenuScene');
        });
    }
}
exports.PreloadScene = PreloadScene;
//# sourceMappingURL=preload-scene.js.map