export interface Window{
    socket: SocketIOClient.Emitter;
    location: {
        reload(forceReload: boolean): void;
    };
    innerHeight: number;
    innerWidth: number;
}

export interface GMObject{
    scene: Phaser.Scene;
    x: number;
    y: number;
    key: string;
    frame: number;
}