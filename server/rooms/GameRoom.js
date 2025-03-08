// server/rooms/GameRoom.js
const colyseus = require('colyseus');
const { GameState } = require('../models');
 
class GameRoom extends colyseus.Room {
  maxClients = 8;
 
  onCreate(options) {
    this.setState(new GameState());
    this.state.mode = options.mode || "game";
    console.log(`Room created with mode: ${this.state.mode}`);
 
    this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000 / 60);
 
    this.onMessage("input", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = data.x;
        player.y = data.y;
        player.rotation = data.rotation;
      }
    });
 
    this.onMessage("stuntCombo", (client, combo) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.score += combo.points;
        player.coins += combo.coins;
      }
    });
 
    // Additional messages (e.g., for customization, combat) can be added here.
  }
 
  onJoin(client, options) {
    // Create a new player entry
    const player = this.state.players[client.sessionId] = this.state.players[client.sessionId] || {};
    player.x = 0;
    player.y = 0;
    player.rotation = 0;
    player.score = 0;
    player.coins = 0;
    player.knockedOff = false;
    player.team = (this.state.mode.startsWith("team")) ? assignTeam(this) : "";
    player.skinId = options.skinId || "bike";
 
    if (this.state.mode === "tag" && this.state.itPlayer === "") {
      this.state.itPlayer = client.sessionId;
    }
    console.log(`Player ${client.sessionId} joined room ${this.roomId}`);
  }
 
  onLeave(client) {
    delete this.state.players[client.sessionId];
    if (this.state.mode === "tag" && this.state.itPlayer === client.sessionId) {
      this.state.itPlayer = "";
    }
    console.log(`Player ${client.sessionId} left.`);
  }
 
  update(deltaTime) {
    // Example collision/knockoff detection logic
    const players = this.state.players;
    for (let idA in players) {
      for (let idB in players) {
        if (idA === idB) continue;
        // Simple distance check (collision threshold)
        const playerA = players[idA], playerB = players[idB];
        const dx = playerA.x - playerB.x;
        const dy = playerA.y - playerB.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 2500) { // e.g., 50px collision threshold
          // In combat modes, mark playerB as knocked off
          if (this.state.mode !== "freestyle") {
            playerB.knockedOff = true;
            playerA.score += 10;
          }
        }
      }
    }
 
    // Timer update for time-boxed sessions
    this.state.timeLeft -= 1 / 60;
    if (this.state.timeLeft <= 0) {
      // End game: broadcast leaderboard and disconnect
      this.broadcast("gameOver", { leaderboard: "TBD" });
      this.disconnect();
    }
  }
}
 
function assignTeam(room) {
  let teamCounts = { red: 0, blue: 0 };
  for (let id in room.state.players) {
    const p = room.state.players[id];
    if (p.team === "red") teamCounts.red++;
    if (p.team === "blue") teamCounts.blue++;
  }
  return (teamCounts.red <= teamCounts.blue) ? "red" : "blue";
}
 
module.exports = GameRoom;
