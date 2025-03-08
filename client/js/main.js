// client/js/main.js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
      default: 'matter',
      matter: {
        gravity: { y: 1 },
        debug: false
      }
    },
    scene: [MenuScene, GameScene, UIScene]
  };
  
  window.game = new Phaser.Game(config);
  