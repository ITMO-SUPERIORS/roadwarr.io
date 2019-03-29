export class GameEvent{
    public static readonly authentification: string = "authentification:successful";
    public static readonly end: "game:over";
    public static readonly start: "game:start";
    public static readonly drop: "drop"; // ?????
}

export class ServerEvent {
    public static readonly connected: string = "connection";
    public static readonly disconnected: string = "disconnect";
}

export class PlayerEvent {
    public static readonly joined: string = "player:joined";
    public static readonly protagonist: string = "player:protagonist";
    public static readonly players: string = "actors:collection";
    public static readonly quit: string = "players:left";
    public static readonly pickup: string = "player:pickup";
    public static readonly hit: string = "player:hit";
    public static readonly coordinates: string = "player:coordinates";
}

export class CivilEvent{
    public static readonly create: string = "civil:create";
    public static readonly destroy: string = "civil:destroy";
    public static readonly hit: string = "civil:hit";
    public static readonly coordinates: string = "civil:coordinates";
}