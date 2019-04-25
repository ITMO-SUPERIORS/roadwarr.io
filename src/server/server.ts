import { Request, Response } from "express";
// import { Socket } from "socket.io";
import { DomainSocket } from "../shared/models";
// import { PlayerEvent, GameEvent } from "../shared/events.model";
// import { Player } from "../client/objects/player";
import path = require('path');
import express from "express";

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// let players = {};

app.use(express.static(path.resolve(__dirname, '../..')));

// app.get('/', (req: Request, res: Response) => {
//     res.sendFile(path.resolve(__dirname, '../..', 'index.html'));
// })

class GameServer {
    constructor(){
        this.socketEvents();
    }

    public connect(port: number): void {
        server.listen(port, () => {
            console.info(`Listening on port ${port}`);
        })
    }

    private socketEvents(): void{
        io.on('connection', (socket: DomainSocket) => {
            console.log("Hi, baby");
            socket.emit("gotoMenu");
        });
    }

    // private attachListeners(socket: DomainSocket): void{
        
    //     // this.addSignOnListener(socket);
    //     // this.addSignOutListener(socket);
    //     // this.addPlayerReadyListener(socket);
    // }

    // private addPlayerReadyListener(socket: Socket): void{
    //     socket.on(PlayerEvent.isReady, () => {
    //         socket.broadcast.emit(PlayerEvent.isReady);
    //     });
    // }

    // private addSignOnListener(socket: DomainSocket): void{
    //     socket.on(
    //         GameEvent.authentification,
    //         (player: Player) => {
    //             socket.emit(PlayerEvent.opponent, socket.player);
    //             socket.emit(GameEvent.menu);
    //         }
    //     )
    //     // отправить другим игрокам информацию о присоединении нового игрока
    //     socket.emit('currentPlayers', players)
    //     // обновить всех игроков для нового игрока
    //     socket.broadcast.emit('newPlayer', players[socket.id]);

    // }

    // private addSignOutListener(socket: Socket): void{
    //     socket.on('disconnect', () => {
    //         console.log('user disconnected');
    //         // удаление игрока
    //         delete players[socket.id];
    //         // удаление этого игрока для остальных игроков
    //         socket.emit('disconnect', socket.id);
    //     });
    // }
}

const gameSession = new GameServer();

gameSession.connect(3000);



