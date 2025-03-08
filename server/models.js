// server/models.js
const Schema = require('@colyseus/schema').Schema;
const type = require('@colyseus/schema').type;
const MapSchema = require('@colyseus/schema').MapSchema;

class PlayerState extends Schema {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.score = 0;
    this.coins = 0;
    this.knockedOff = false;
    this.team = ""; // For team modes
    this.skinId = "bike"; // Default skin id
  }
}
type("number")(PlayerState.prototype, "x");
type("number")(PlayerState.prototype, "y");
type("number")(PlayerState.prototype, "rotation");
type("number")(PlayerState.prototype, "score");
type("number")(PlayerState.prototype, "coins");
type("boolean")(PlayerState.prototype, "knockedOff");
type("string")(PlayerState.prototype, "team");
type("string")(PlayerState.prototype, "skinId");

class GameState extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
    this.mode = "game";
    this.timeLeft = 60; // seconds for a match
    this.itPlayer = ""; // For tag mode
  }
}
type({ map: PlayerState })(GameState.prototype, "players");
type("string")(GameState.prototype, "mode");
type("number")(GameState.prototype, "timeLeft");
type("string")(GameState.prototype, "itPlayer");

module.exports = { PlayerState, GameState };
