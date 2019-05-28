export class GameEvent{
    public static readonly authentification: string = "authentification:successful";
    public static readonly gameStarted: string = "game:play";
    public static readonly menu: string = "game:menu";
    public static readonly end: string = "game:over";
    public static readonly start: string = "game:start";
}

export class CoinEvent {
    public static readonly create: string = "coin:create";
    public static readonly update: string = "coin:update";
    public static readonly destroy: string = "coin:destroy";
}

export class RockEvent {
    public static readonly create: string = "rock:create";
    public static readonly update: string = "rock:update";
    public static readonly destroy: string = "rock:destroy";
}

export class CivilEvent{
    public static readonly create: string = "civil:create";
    public static readonly destroy: string = "civil:destroy";
}

export class ServerEvent {
    public static readonly connected: string = "connection";
    public static readonly disconnected: string = "disconnect";
}

export class PlayerEvent {

    public static readonly joined: string = "player:joined";
    public static readonly allPlayers: string = "player:allPlayers";
    public static readonly protagonist: string = "player:protagonist";
    public static readonly newPlayer: string = "player:newPlayer";
    public static readonly opponent: string = "player:opponent";
    public static readonly isReady: string = "player:isReady";
    public static readonly move: string = "player:move";
    public static readonly updatePos: string = "player:updatePosition";

    public static readonly quit: string = "players:left";
    public static readonly pickup: string = "player:pickup";
    public static readonly hit: string = "player:hit";
    public static readonly coordinates: string = "player:coordinates";
}

