// components/GameShell.jsx
import './GameShell.css';

const GameShell = ({ children }) => {
  return (
    <div className="game-container">
      {children}
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
  );
};

export default GameShell;