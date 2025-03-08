// client/js/scenes/MenuScene.js
class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }
    
    preload() {
      this.load.image('menu_bg', 'assets/menu_bg.png');
    }
    
    create() {
      this.add.image(400, 300, 'menu_bg');
      this.add.text(400, 100, "Moto Madness", { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      
      // Create mode buttons
      const freestyleBtn = this.add.text(400, 200, "Freestyle", { fontSize: '24px', backgroundColor: '#007BFF' }).setOrigin(0.5).setInteractive();
      const tagBtn = this.add.text(400, 250, "Tag Mode", { fontSize: '24px', backgroundColor: '#007BFF' }).setOrigin(0.5).setInteractive();
      const teamBtn = this.add.text(400, 300, "Team Battle", { fontSize: '24px', backgroundColor: '#007BFF' }).setOrigin(0.5).setInteractive();
      
      freestyleBtn.on('pointerup', () => this.startGame('freestyle'));
      tagBtn.on('pointerup', () => this.startGame('tag'));
      teamBtn.on('pointerup', () => this.startGame('team_battle'));
    }
    
    startGame(mode) {
      // Pass selected mode and any customization options (e.g., skinId)
      this.scene.start('GameScene', { mode: mode, skinId: "bike" });
    }
  }
  