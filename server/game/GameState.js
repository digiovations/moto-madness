import { Schema, type, MapSchema } from '@colyseus/schema';
import { Player } from './Player.js';

export class GameState extends Schema {
    @type({ map: Player }) players = new MapSchema();
    @type("number") roundTime = 60;
}
