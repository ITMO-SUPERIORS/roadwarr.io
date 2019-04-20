"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameEvent {
}
GameEvent.authentification = "authentification:successful";
exports.GameEvent = GameEvent;
class ServerEvent {
}
ServerEvent.connected = "connection";
ServerEvent.disconnected = "disconnect";
exports.ServerEvent = ServerEvent;
class PlayerEvent {
}
PlayerEvent.joined = "player:joined";
PlayerEvent.protagonist = "player:protagonist";
PlayerEvent.opponent = "player:opponent";
PlayerEvent.isReady = "player:isReady";
PlayerEvent.quit = "players:left";
PlayerEvent.pickup = "player:pickup";
PlayerEvent.hit = "player:hit";
PlayerEvent.coordinates = "player:coordinates";
exports.PlayerEvent = PlayerEvent;
class CivilEvent {
}
CivilEvent.create = "civil:create";
CivilEvent.destroy = "civil:destroy";
CivilEvent.hit = "civil:hit";
CivilEvent.coordinates = "civil:coordinates";
exports.CivilEvent = CivilEvent;
//# sourceMappingURL=events.model.js.map