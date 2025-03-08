// server/index.js
const http = require('http');
const express = require('express');
const colyseus = require('colyseus');
const GameRoom = require('./rooms/GameRoom');
const FreestyleRoom = require('./rooms/FreestyleRoom');
const TagRoom = require('./rooms/TagRoom');
const TeamRoom = require('./rooms/TeamRoom');

const app = express();

// Serve client static files (assumes client folder is sibling to server folder)
app.use(express.static('../client'));

const server = http.createServer(app);
const gameServer = new colyseus.Server({ server });

// Define room handlers
gameServer.define("game", GameRoom);
gameServer.define("freestyle", FreestyleRoom);
gameServer.define("tag", TagRoom);
gameServer.define("team_battle", TeamRoom);

const port = process.env.PORT || 2567;
gameServer.listen(port);
console.log(`Server running on ws://localhost:${port}`);
