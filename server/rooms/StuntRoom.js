import { Room } from 'colyseus';
import { GameState } from '../game/GameState.js';
import { Player } from '../game/Player.js';

export class StuntRoom extends Room {
    maxClients = 8;

    onCreate() {
        this.setState(new GameState());

        this.onMessage("move", (client, message) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.x += message.dx;
                player.y += message.dy;
            }
        });

        this.onMessage("stunt", (client, stuntType) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                let score = stuntType === "flip" ? 50 : stuntType === "wheelie" ? 30 : 10;
                player.score += score;
            }
        });

        this.setSimulationInterval(() => {
            this.state.roundTime -= 1;
            if (this.state.roundTime <= 0) {
                this.disconnect();
            }
        }, 1000);
    }

    onJoin(client) {
        this.state.players.set(client.sessionId, new Player(client.sessionId));
    }

    onLeave(client) {
        this.state.players.delete(client.sessionId);
    }
}
