// client/js/scenes/GameScene.js
class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
    }
    
    init(data) {
      this.mode = data.mode || "game";
      this.skinId = data.skinId || "bike";
      this.room = null;
      this.playerId = null;
      this.playerSprites = new Map();
      this.inAir = false;
      this.rotations = 0;
    }
    
    preload() {
      this.load.image('bike', 'assets/bike.png');
      this.load.image('track', 'assets/track.png');
    }
    
    create() {
      this.add.image(400, 300, 'track');
      this.matter.world.setBounds(0, 0, 800, 600);
      
      // Connect to Colyseus server (adjust endpoint if needed)
      const endpoint = (location.protocol === "https:" ? "wss://" : "ws://") + location.hostname + (location.port ? ":" + location.port : ":2567");
      const client = new Colyseus.Client(endpoint);
      client.joinOrCreate(this.mode, { skinId: this.skinId }).then(room => {
        this.room = room;
        this.playerId = room.sessionId;
        console.log("Joined room:", room.name, "as", this.playerId);
        this.setupRoomListeners();
      }).catch(e => {
        console.error("Failed to join room:", e);
        this.scene.start('MenuScene');
      });
      
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    
    setupRoomListeners() {
      // When a new player joins, create a sprite
      this.room.state.players.onAdd = (player, sessionId) => {
        const sprite = this.matter.add.sprite(player.x, player.y, player.skinId || 'bike');
        sprite.setOrigin(0.5, 0.5);
        sprite.setCircle(sprite.width / 2);
        sprite.setFrictionAir(0.02);
        sprite.setFixedRotation(false);
        this.playerSprites.set(sessionId, sprite);
        if (sessionId === this.playerId) {
          this.cameras.main.startFollow(sprite, true, 0.1, 0.1);
        }
      };
      
      this.room.state.players.onRemove = (player, sessionId) => {
        const sprite = this.playerSprites.get(sessionId);
        if (sprite) sprite.destroy();
        this.playerSprites.delete(sessionId);
      };
      
      this.room.state.players.onChange = (player, sessionId) => {
        const sprite = this.playerSprites.get(sessionId);
        if (sprite) {
          sprite.setPosition(player.x, player.y);
          sprite.setRotation(player.rotation);
          if (player.knockedOff) {
            sprite.setTint(0xff0000);
          } else {
            sprite.clearTint();
          }
        }
      };
      
      this.room.onMessage("gameOver", (data) => {
        console.log("Game Over. Leaderboard:", data.leaderboard);
        this.scene.start('MenuScene', { leaderboard: data.leaderboard });
      });
      
      this.room.onMessage("leaderboard", (data) => {
        this.events.emit('updateLeaderboard', data.topPlayers);
      });
    }
    
    update() {
      if (!this.room) return;
      const mySprite = this.playerSprites.get(this.playerId);
      if (mySprite) {
        // Handle input: left/right for rotation, up to thrust, space for jump/stunt
        if (this.cursors.left.isDown) {
          mySprite.body.torque = -0.001;
        }
        if (this.cursors.right.isDown) {
          mySprite.body.torque = 0.001;
        }
        if (this.cursors.up.isDown) {
          mySprite.thrust(0.005);
        }
        if (this.cursors.down.isDown) {
          mySprite.setVelocityX(mySprite.body.velocity.x * 0.95);
        }
        if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
          mySprite.setVelocityY(-5);
        }
        
        // Send updated position to server
        this.room.send("input", {
          x: mySprite.x,
          y: mySprite.y,
          rotation: mySprite.rotation
        });
        
        // Simple stunt tracking: count full rotations while airborne
        if (!this.inAir && !mySprite.body.blocked.down) {
          this.inAir = true;
          this.startRotation = mySprite.rotation;
        }
        if (this.inAir) {
          let deltaRot = mySprite.rotation - this.startRotation;
          if (Math.abs(deltaRot) >= 6.28) { // 2*PI for a full rotation
            this.rotations += Math.sign(deltaRot);
            this.startRotation = mySprite.rotation;
          }
          if (mySprite.body.blocked.down) {
            if (this.rotations !== 0) {
              const points = Math.abs(this.rotations) * 100;
              const coins = Math.abs(this.rotations) * 10;
              this.room.send("stuntCombo", { points, coins });
              this.events.emit('showCombo', points);
            }
            this.inAir = false;
            this.rotations = 0;
          }
        }
      }
    }
  }
  