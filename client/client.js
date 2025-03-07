import { Client } from 'colyseus.js';

const client = new Client('ws://localhost:2567');
let room;

client.joinOrCreate("stunt_room").then(r => {
    room = r;

    room.onMessage("state", state => {
        console.log("Game State:", state);
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
            room.send("move", { dx: 0, dy: -5 });
        } else if (event.key === " ") {
            room.send("stunt", "flip");
        }
    });
});
