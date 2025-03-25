import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const PhaserCanvas = () => {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: containerRef.current,
      backgroundColor: '#1e1e2f',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    gameRef.current = new Phaser.Game(config);

    function preload() {
      this.load.image('background', '/assets/images/backgroundGIF.gif');
      this.load.image('spellbook', '/assets/images/spellbookonline.png');
    }

    function create() {
      const bg = this.add.image(0, 0, 'background');
      bg.setOrigin(0.5);
    
      const book = this.add.image(0, 0, 'spellbook')
        .setScale(0.3)
        .setInteractive({ useHandCursor: true });
    
      book.on('pointerdown', () => {
        window.dispatchEvent(new Event('open-spellbook'));
      });
    
      book.on('pointerover', () => book.setTint(0xaaffcc));
      book.on('pointerout', () => book.clearTint());
    
      const resizeScene = (gameSize = this.scale.gameSize) => {
        const { width, height } = gameSize;
        const isFullscreen = this.scale.isFullscreen;
      
        // Resize + center background
        bg.setPosition(width / 2, height / 2);
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const bgScale = Math.max(scaleX, scaleY);
        bg.setScale(bgScale);
      
        // Reposition spellbook differently depending on fullscreen
        if (isFullscreen) {
          // Place it lower/right in fullscreen
          book.setPosition((2*width)/5 , 2* height / 3  );
          book.setScale(.4)
        } else {
          // Place it over the table in normal layout
          book.setPosition((2*width)/5 , 2* height / 3  );
          book.setScale(.3)
        }
      };
    
      // Initial layout
      resizeScene();
    
      // Re-layout on fullscreen or window resize
      this.scale.on('resize', resizeScene);
    }
    

    function update() {}

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  return <div ref={containerRef} id="phaser-root" style={{ width: '100%', height: '100%' }} />;
};

export default PhaserCanvas;
