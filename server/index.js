import express from 'express';
import { Server } from 'colyseus';
import { createServer } from 'http';
import { StuntRoom } from './rooms/StuntRoom.js';

const app = express();
const server = createServer(app);
const gameServer = new Server({ server });

gameServer.define("stunt_room", StuntRoom);
gameServer.listen(2567);

console.log("Multiplayer Stunt Game Server running on ws://localhost:2567");
