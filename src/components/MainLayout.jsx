import './MainLayout.css';
import SpellwrightLogo from '/assets/images/spellwright_logo.png';
import PhaserCanvas from '@/phaser/PhaserCanvas'; // Make sure this import is correct

const MainLayout = () => {
  return (
    <div className="app-wrapper">
      <header className="game-header">
        <img src={SpellwrightLogo} alt="Spellwright Logo" className="spellwright-logo" />
      </header>

      <div className="main-layout">
        <div className="game-container">
          <PhaserCanvas /> {/* ← render Phaser directly here */}
          <button
            className="fullscreen-btn"
            onClick={() => {
              const phaserWrapper = document.getElementById('phaser-root') || document.body;
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
};

export default MainLayout;
