// server/rooms/TagRoom.js
const GameRoom = require('./GameRoom');
 
class TagRoom extends GameRoom {
  onCreate(options) {
    options.mode = "tag";
    super.onCreate(options);
  }
 
  update(deltaTime) {
    // In Tag mode, check if "it" player tags another to transfer status.
    // For brevity, we use the same update loop as GameRoom.
    super.update(deltaTime);
  }
}
 
module.exports = TagRoom;
