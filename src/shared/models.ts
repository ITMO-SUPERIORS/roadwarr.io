import { Socket } from "socket.io";

export interface Civil {
    id: string;
}

export interface Object {
    x: number;
    y: number;
    frame: number;
}

export interface PlayerCar {
    name: string;
    id: string;
    x: number;
    y: number;
    frame: number;
    score: number;
}

export interface Coordinates {
    x: number;
    y: number;
}

export interface GameSize{
    width: number;
    height: number;
    roadWidth: number;
    roadScale: number;
    roadSide: number;
}

export interface Rooms{
    [room: string]: Room
}

export interface Room{
    roomId: number
    players: Players
}

export interface Players{
    [playerId: string]: Player
}
export interface Player{
    id: string;
    x: number;
    y: number;
    score: number;
    opponent?: Player;
    // id: string;
    // uuid?: string;
    // name: string;
    // x: number;
    // y: number;
    // player?: Player;
    // coors?: Coordinates & playerActions;
}

export interface DomainSocket extends Socket {
    civil: Object;
    coin: Object;
    rock: Object;
    player: Player;
}

export type PlayerTypes = "car-sprite-enemy" | "car-sprite";