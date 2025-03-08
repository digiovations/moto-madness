# Moto Madness

A multiplayer motorcycle stunt game featuring real-time gameplay with Colyseus and Phaser 3.

## Features
- Multiplayer matchmaking and state sync using Colyseus
- Stunt mechanics with flips, wheelies, and combo scoring
- Combat mechanics: players can knock opponents off bikes
- Multiple game modes: Freestyle, Tag, Team Battles
- Leaderboards, XP system, in-game currency, and unlockable customizations
- Spectator mode to watch live matches
- Polished UI with a main menu and in-game HUD
- Dockerized for easy deployment (e.g. on Azure Web Apps)

## Setup

### Server
1. Navigate to the `server` folder.
2. Run `npm install`.
3. Start the server: `npm start`.

### Client
The client is served statically by the server. Open your browser to `http://localhost:2567` to play.

### Docker
1. Build the image: `docker build -t moto-madness .`
2. Run the container: `docker run -p 2567:2567 moto-madness`

## Deployment
You can deploy the Docker container to Azure Web Apps (or any container hosting service).

