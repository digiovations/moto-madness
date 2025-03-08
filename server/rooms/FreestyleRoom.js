// server/rooms/FreestyleRoom.js
const GameRoom = require('./GameRoom');
 
class FreestyleRoom extends GameRoom {
  onCreate(options) {
    options.mode = "freestyle";
    super.onCreate(options);
  }
 
  update(deltaTime) {
    // Override combat: no knockoffs in freestyle mode.
    this.state.timeLeft -= 1 / 60;
    if (this.state.timeLeft <= 0) {
      this.broadcast("gameOver", { leaderboard: "TBD" });
      this.disconnect();
    }
  }
}
 
module.exports = FreestyleRoom;
