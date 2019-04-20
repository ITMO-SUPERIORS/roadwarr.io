"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { PlayerEvent, GameEvent } from "../shared/events.model";
// import { Player } from "../client/objects/player";
const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
// let players = {};
app.use(express.static(path.resolve(__dirname, '../..')));
// app.get('/', (req: Request, res: Response) => {
//     res.sendFile(path.resolve(__dirname, '../..', 'index.html'));
// })
class GameServer {
    constructor() {
        this.socketEvents();
    }
    connect(port) {
        server.listen(port, () => {
            console.info(`Listening on port ${port}`);
        });
    }
    socketEvents() {
        io.on('connection', (socket) => {
            console.log("Hi, baby");
            socket.emit("gotoMenu");
        });
    }
}
const gameSession = new GameServer();
gameSession.connect(3000);
//# sourceMappingURL=server.js.map