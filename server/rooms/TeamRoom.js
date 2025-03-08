// server/rooms/TeamRoom.js
const GameRoom = require('./GameRoom');
 
class TeamRoom extends GameRoom {
  onCreate(options) {
    options.mode = "team";
    super.onCreate(options);
  }
 
  update(deltaTime) {
    // In team mode, you may want to prevent friendly knockoffs.
    // For simplicity, we call the base update.
    super.update(deltaTime);
  }
}
 
module.exports = TeamRoom;
