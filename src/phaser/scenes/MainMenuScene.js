export default class MainMenuScene extends Phaser.Scene {
    constructor() {
      super('MainMenuScene');
    }
  
    preload() {
      this.load.image('background', '/assets/images/background.png');
      this.load.image('spellbook', '/assets/images/spellbookonline.png');
      this.load.image('glitter', '/assets/images/glitter.png');
      this.load.image('cauldron', '/assets/images/cauldron.png');
      this.load.image('playbutton', '/assets/images/playbuttonF.png');
    }
  
    create() {
      const { width, height } = this.scale;
  
      const bg = this.add.image(0, 0, 'background').setOrigin(0);
      const book = this.add.image(0, 0, 'spellbook').setInteractive({ useHandCursor: true });
      const cauldron = this.add.image(0, 0, 'cauldron').setInteractive({ useHandCursor: true });
      const playbutton = this.add.image(0, 0, 'playbutton').setInteractive({ useHandCursor: true });
  
      book.on('pointerdown', () => window.dispatchEvent(new Event('open-spellbook')));
      cauldron.on('pointerdown', () => console.log('Clicked cauldron!'));
      playbutton.on('pointerdown', () => this.scene.start('LevelSelectScene')); // ← scene switch
  
      [book, cauldron, playbutton].forEach(el => {
        el.on('pointerover', () => el.setTint(0xe55ed5));
        el.on('pointerout', () => el.clearTint());
      });
  
      const resizeScene = () => {
        const { width, height } = this.scale.gameSize;
        const isFullscreen = this.scale.isFullscreen;
  
        bg.setPosition(0, isFullscreen ? 0 : -height / 9);
        const scale = Math.max(width / bg.width, height / bg.height);
        bg.setScale(scale);
  
        book.setPosition((1.65 * width) / 5, isFullscreen ? 2.26 * height / 3 : 2.17 * height / 3);
        cauldron.setPosition((3.45 * width) / 5, isFullscreen ? 3.35 * height / 5 : 3.18 * height / 5);
        playbutton.setPosition((2.48 * width) / 5, isFullscreen ? 3.5 * height / 5 : 3.38 * height / 5);
  
        const scaleFactor = isFullscreen ? 1.45 : 1.1;
        book.setScale(scaleFactor);
        cauldron.setScale(scaleFactor);
        playbutton.setScale(scaleFactor + 0.05);
      };
  
      resizeScene();
      this.scale.on('resize', resizeScene);
    }
  
    update() {}
  }
  