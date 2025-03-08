// client/js/scenes/UIScene.js
class UIScene extends Phaser.Scene {
    constructor() {
      super({ key: 'UIScene', active: true });
    }
    
    create() {
      this.scoreText = this.add.text(10, 10, "Score: 0", { fontSize: '20px', fill: '#fff' });
      this.comboText = this.add.text(400, 300, "", { fontSize: '32px', fill: '#ff0' }).setOrigin(0.5);
      this.leaderboardText = this.add.text(600, 10, "", { fontSize: '16px', fill: '#fff' });
      
      const gameScene = this.scene.get('GameScene');
      gameScene.events.on('showCombo', (points) => {
        this.comboText.setText(`Combo +${points}!`);
        this.comboText.setAlpha(1);
        this.tweens.add({
          targets: this.comboText,
          alpha: 0,
          duration: 1500,
          ease: 'Cubic.easeOut'
        });
      });
      
      gameScene.events.on('updateLeaderboard', (topPlayers) => {
        let text = "Leaderboard:\n";
        topPlayers.forEach((p, i) => {
          text += `${i + 1}. ${p.name} - ${p.xp} XP\n`;
        });
        this.leaderboardText.setText(text);
      });
    }
    
    update() {
      const gameScene = this.scene.get('GameScene');
      if (gameScene.room && gameScene.playerId) {
        const player = gameScene.room.state.players[gameScene.playerId];
        if (player) {
          this.scoreText.setText(`Score: ${player.score}`);
        }
      }
    }
  }
  