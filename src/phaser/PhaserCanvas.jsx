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
      this.load.image('background', '/assets/images/background.png');
      this.load.image('spellbook', '/assets/images/spellbookonline.png');
      this.load.image('glitter', '/assets/images/glitter.png');
      this.load.image('cauldron', '/assets/images/cauldron.png');
      this.load.image('playbutton', '/assets/images/playbuttonF.png')

    }

    function create() {


      const bg = this.add.image(0, 0, 'background');
      bg.setOrigin(0.);


    /****************************BOOK **************************** */
const book = this.add.image(0, 0, 'spellbook')
.setInteractive({ useHandCursor: true });

book.on('pointerdown', () => {
window.dispatchEvent(new Event('open-spellbook'));
});

book.on('pointerover', () => {
book.setTint(0xe55ed5); 

});

book.on('pointerout', () => {
book.clearTint();

});

/****************************CAULDRON************************** */
const cauldron = this.add.image(0, 0, 'cauldron')
.setInteractive({ useHandCursor: true });

cauldron.on('pointerdown', () => {
console.log('Clicked the cauldron!');
});

cauldron.on('pointerover', () => {
cauldron.setTint(0xe55ed5); // Blue glow effect on hover

});

cauldron.on('pointerout', () => {
cauldron.clearTint();

});

/******************************PLAY BUTTON********************* */
const playbutton = this.add.image(0, 0, 'playbutton')
.setInteractive({ useHandCursor: true });

playbutton.on('pointerdown', () => {
  window.location.href = '/play';
});

playbutton.on('pointerover', () => {
playbutton.setTint(0xe55ed5); // Blue glow effect on hover

});

playbutton.on('pointerout', () => {
playbutton.clearTint();

});

  
    
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
           //BACKGROUND
           bg.setPosition(0 , 0); 

            // BOOK
            book.setPosition((1.65*width)/5 , 2.26* height / 3   );
            book.setScale(1.45)


            //CAULDRON

            cauldron.setPosition((3.45*width)/5 , 3.35* height / 5  ); 
            cauldron.setScale(1.45);

            //PLAY BUTTON
            playbutton.setPosition((2.48*width)/5 , 3.5* height / 5  ); 
            playbutton.setScale(1.5);

        } else {
          //BACKGROUND
          bg.setPosition(0 , -height/9); 

          // BOOK
          book.setPosition((1.65*width)/5 , 2.17* height / 3   );
          book.setScale(1.1)


          //CAULDRON

          cauldron.setPosition((3.45*width)/5 , 3.18* height / 5  ); 
           cauldron.setScale(1.10);

           //PLAY BUTTON
          playbutton.setPosition((2.48*width)/5 , 3.38* height / 5  ); 
          playbutton.setScale(1.15);
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
