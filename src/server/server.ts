import { Request, Response } from "express";
import { Socket } from "socket.io";

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);
let players = {};

app.use(express.static(__dirname + '/public'));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/index.html');
})

class GameServer {
    constructor(){
        this.socketEvents();
    }

    private socketEvents(): void{
        io.on('connection', (socket: Socket) => {
            this.attachListeners(socket);            
        });
    }

    private attachListeners(socket: Socket): void{
        this.addSignOnListener(socket);
        this.addSignOutListener(socket);
    }

    private addSignOnListener(socket: Socket): void{
        console.log('a user connected');
        players[socket.id] = {
            playerID: socket.id
        }
        // отправить другим игрокам информацию о присоединении нового игрока
        socket.emit('currentPlayers', players)
        // обновить всех игроков для нового игрока
        socket.broadcast.emit('newPlayer', players[socket.id]);

    }

    private addSignOutListener(socket: Socket): void{
        socket.on('disconnect', () => {
            console.log('user disconnected');
            // удаление игрока
            delete players[socket.id];
            // удаление этого игрока для остальных игроков
            socket.emit('disconnect', socket.id);
        });
    }
}

server.listen(8081, () => {
    console.log(`listening on ${server.address().port}`);
});



