import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainMenuScene from './scenes/MainMenuScene';
import LevelSelectScene from './scenes/LevelSelectScene';

const PhaserCanvas = () => {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: containerRef.current,
      backgroundColor: '#0d1020',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [MainMenuScene, LevelSelectScene],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  return <div ref={containerRef} id="phaser-root" style={{ width: '100%', height: '100%' }} />;
};

export default PhaserCanvas;
