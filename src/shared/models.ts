import { Socket } from "socket.io";

export interface Civil {
    id: string;
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


//?????
interface playerActions {
    
}


export interface Player{
    id: string;
    uuid?: string;
    name: string;
    x: number;
    y: number;
    player?: Player;
    coors?: Coordinates & playerActions;
}

export interface Window{
    // socket: SocketIOClient.Emitter;
    location: {
        reload(forceReload: boolean): void;
    };
    innerHeight: number;
    innerWidth: number;
}

export interface DomainSocket extends Socket {
    civil: {
        id: string;
    };
    player: Player;
}

export type PlayerTypes = "car-sprite-enemy" | "car-sprite";