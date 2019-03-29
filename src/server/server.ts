// подключение модулей и т.п.
import {Request, Response } from "express";
// import Path from 'path';
import { Socket } from "socket.io";
import { DomainSocket, Player, PlayerCar, Coordinates } from "../shared/models";
import { ServerEvent, GameEvent, PlayerEvent} from "../shared/events.model";

// объявление переменных
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const uuid = require("uuid");

app.use(express.static("public"));
app.get("/", (req: Request, res: Response) => {
    res.sendFile('./index.html');
});

class GameServer {
    private gameHasStarted: boolean = false;

    constructor() {
        this.socketEvents();
    }

    public connect(port: number): void {
        http.listen(port, () => {
            console.info(`Listening on port ${port}`);
        })
    }

    private socketEvents(): void {
        io.on(ServerEvent.connected, (socket: DomainSocket) => {
            this.attachListeners(socket);
        });
    }

    private attachListeners(socket: DomainSocket): void{
        this.addSignOnListener(socket);
        this.addSignOutListener(socket);
    }

    private addSignOutListener(socket: DomainSocket): void {
        socket.on(ServerEvent.disconnected, () => {
            if (socket.player) {
                socket.broadcast.emit(PlayerEvent.quit, socket.player.id)
            }
        });
    }

    // подключение нового игрока
    private addSignOnListener(socket: DomainSocket): void{
        socket.on(
            GameEvent.authentification,
            (player: Player, gameSize: Coordinates) => {
                socket.emit(PlayerEvent.players, this.getAllPlayers()); // получить список игроков?
                this.createPlayer(socket, player, gameSize);
                // отправить другим игрокам информацию о присоединении нового игрока
                socket.emit(PlayerEvent.protagonist, socket.player); 
                // обновить всех игроков для нового игрока
                socket.broadcast.emit(PlayerEvent.joined, socket.player);
                // запуск игры
                this.gameInitialised(socket);
            }
        )
    }

    // Создаём нового игрока
    private createPlayer(
        socket: DomainSocket,
        player: Player,
        windowSize: Coordinates
    ): void {
        socket.player = {
            name: player.name,
            id: uuid(),
            y: windowSize.y / 2,
            x: windowSize.x / 2
        };
    }

    private getAllPlayers(): Array<PlayerCar> {
        return Object.keys(io.sockets.connected).reduce((acc, socketID) =>{
            const player = io.sockets.connected[socketID].player;
            if (player){
                acc.push(player);
            }
            return acc;
        }, []);
    }

    private gameInitialised(socket: DomainSocket): void{
        if (this.gameHasStarted){
            this.gameHasStarted = true;
        }
    }
}

const gameSession = new GameServer();

gameSession.connect(8000);
