import { DomainSocket as Socket, Player, GameSize } from "../shared/models";
import { PlayerEvent, GameEvent, CoinEvent, RockEvent, CivilEvent } from "../shared/events.model";
import path = require('path');
import express from "express";

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.resolve(__dirname, '../../public')));

class GameServer {
    private hasCoin: boolean = false;
    private hasRock: boolean = false;
    private hasCivil: boolean = false;
    private players: Player[] = [];
    constructor(){
        this.socketEvents();
    }

    public connect(port: number): void {
        server.listen(port, () => {
            console.info(`Listening on port ${port}`);
        })
    }

    private socketEvents(): void{
        io.on('connection', (socket: Socket) => {
            this.attachListeners(socket);
        });
    }

    private attachListeners(socket: Socket): void{
        this.gameStartListener(socket);
        this.playerMovementListener(socket);
    }

    // private waitplayers(socket: Socket): void{
    //     socket.on(GameEvent.start, () =>{
    //         let playersInRoom = Object.keys(io.in(this.room).sockets).length;
    //         if (playersInRoom == 2){
    //             socket.emit(GameEvent.start);
    //             socket.broadcast.emit(GameEvent.start);
    //         }
    //     })
    // }

    // Старт игры
    private gameStartListener(socket: Socket): void {
        // При выходк игрока в меню, он удаляется из массива с игроками
        socket.on(GameEvent.menu, () => {
            let index = this.players.indexOf(socket.player);
            this.players.splice(index, 1);
        })
        socket.on(GameEvent.gameStarted, (gameSize: GameSize)=> {
            this.addPlayer(socket, gameSize);
            this.addCoin(socket, gameSize, 5000);
            this.addCivil(socket, gameSize, 2000);
            this.addRocks(socket, gameSize);
        })
    }

     // Создание нового игрока
     private addPlayer(socket: Socket, gameSize: GameSize){
        // Если в игре уже есть игрок, добавляем его
        if (this.players[0]){
            socket.emit(PlayerEvent.opponent, this.players[0]);
        }
        this.createPlayer(socket, gameSize);
        socket.emit(PlayerEvent.protagonist, socket.player);
        socket.broadcast.emit(PlayerEvent.opponent, socket.player);
        this.players.push(socket.player);
    }

    // Задание параметрова игроку
    private createPlayer(socket: Socket, gameSize: GameSize): void{
        let roadX = gameSize.width / 2 - gameSize.roadWidth * gameSize.roadScale / 2;
        socket.player = {
            id: socket.id,
            x: this.randomInt(
                roadX + gameSize.roadSide, 
                gameSize.width - roadX - 80 - gameSize.roadSide
            ),
            y: gameSize.height / 2,
            score: 0
        }
    }
    // добавление монетки в сцену
    private addCoin(socket: Socket, gameSize: GameSize, interval: number){
        setInterval(() => {
            if (!this.hasCoin) {
                this.createCoin(socket, gameSize);
                this.hasCoin = true;
                socket.emit(CoinEvent.create, socket.coin);
                socket.broadcast.emit(CoinEvent.create, socket.coin);
                this.destroyCoin(socket);
            }
        }, interval)
    }
     // Создание монетки
     private createCoin(socket: Socket, gameSize: GameSize): void {
        let roadX = gameSize.width / 2 - gameSize.roadWidth * gameSize.roadScale / 2;
        socket.coin = {
            x: this.randomInt(
                roadX + gameSize.roadSide, 
                gameSize.width - roadX - 80 - gameSize.roadSide
            ),
            y: -80,
            frame: (this.randomInt(0, 9) < 8 ? 1 : 0)
        }
    }
    // Уничтожение монетки
    private destroyCoin(socket: Socket): void {
        socket.on(CoinEvent.destroy, () => {
            this.hasCoin = false;
            socket.emit(CoinEvent.destroy);
            socket.broadcast.emit(CoinEvent.destroy);
        })
    }
    
    // Добавление мирного автомобиля в сцену
    private addCivil(socket: Socket, gameSize: GameSize, interval: number){
        if (!this.hasCivil){
            setInterval( () => {
                    this.createCivil(socket, gameSize);
                    socket.emit(CivilEvent.create, socket.civil);
                    socket.broadcast.emit(CivilEvent.create, socket.civil);
                }
            , interval);
            this.hasCivil = true;
        }
    }

    // Создание мирного автомобиля
    private createCivil(socket: Socket, gameSize: GameSize): void {
        let roadX = gameSize.width / 2 - gameSize.roadWidth * gameSize.roadScale / 2;
        socket.civil = {
            x: this.randomInt(
                roadX + gameSize.roadSide, 
                gameSize.width - roadX - 80 - gameSize.roadSide
            ),
            y: -120,
            frame: this.randomInt(0, 4)
        }
    }

    // Добавление камня в сцену
    private addRocks(socket: Socket, gameSize: GameSize){
        if (!this.hasRock){
            setInterval( () => {
                this.createRock(socket, gameSize, "left");
                socket.emit(RockEvent.create, socket.rock);
                socket.broadcast.emit(RockEvent.create, socket.rock);
            }, this.randomInt(1000, 1500));
            setInterval( () => {
                this.createRock(socket, gameSize, "right");
                socket.emit(RockEvent.create, socket.rock);
                socket.broadcast.emit(RockEvent.create, socket.rock);
            }, this.randomInt(1000, 1500))
            this.hasRock = true;
        }
    }

    // Создание камня
    private createRock(socket: Socket, gameSize: GameSize, side: string): void {
        let roadX = gameSize.width / 2 - gameSize.roadWidth * gameSize.roadScale / 2;
        socket.rock = {
            x: (side == "left") ? 
                this.randomInt(-50, roadX - 100) : 
                this.randomInt(gameSize.width - roadX, gameSize.width - 50),
            y: -80,
            frame: this.randomInt(0, 3)
        }
    }

    // Обновление позиции игрока
    private playerMovementListener(socket: Socket): void {
        socket.on(PlayerEvent.move, (opponent: Player) => {
            socket.broadcast.emit(PlayerEvent.move, {
                x: opponent.x,
                y: opponent.y,
                id: opponent.id

            });
        });
    }

    private randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    }
}

const gameSession = new GameServer();

gameSession.connect(3000);



