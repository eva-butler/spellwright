import { useEffect, useState } from 'react';
import PhaserCanvas from './phaser/PhaserCanvas';
import './styles/App.css';

function App() {
  const [showSpellbook, setShowSpellbook] = useState(false);

  useEffect(() => {
    const handleOpen = () => setShowSpellbook(true);
    window.addEventListener('open-spellbook', handleOpen);
    return () => window.removeEventListener('open-spellbook', handleOpen);
  }, []);

  return (
    <div className="app-wrapper">
      <header className="game-header">
        <h1>
          <span className="header-sparkle">✦</span>
          Spellwright
          <span className="header-sparkle">✦</span>
        </h1>
      </header>

      <div className="main-layout">
        <div className="game-container">
          <PhaserCanvas />
          <button
            className="fullscreen-btn"
            onClick={() => {
              const phaserWrapper = document.getElementById('phaser-root');
              if (phaserWrapper.requestFullscreen) {
                phaserWrapper.requestFullscreen();
              }
            }}
          >
            ⛶ Fullscreen
          </button>

        </div>

        <div className="sidebar">
          <h2>Settings</h2>
          <p>Volume, difficulty, controls, etc.</p>

          <h2>Info</h2>
          <p>Instructions, potion index, etc.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
