"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./client/game");
const config_1 = require("./config");
window.addEventListener("load", () => {
    let game = new game_1.default(config_1.default);
});
//# sourceMappingURL=index.js.map