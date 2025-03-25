import { useState } from 'react';
import GameCanvas from './pixi/GameCanvas';
import CraftingTable from './components/CraftingTable';
import Spellbook from './components/Spellbook';
import IngredientList from './components/IngredientList';
import LevelSelect from './components/LevelSelect';
import './styles/App.css';

function App() {
  const [showSpellbook, setShowSpellbook] = useState(false);

  return (
    <div className="app-overlay">
      <div className="left-column">
        <LevelSelect />
        <IngredientList />
      </div>

      <div className="center-column">
        <GameCanvas />
      </div>

      <div className="right-column">
        <CraftingTable />
        <Spellbook />
      </div>

      {/* Glowy Button Over Spellbook */}
      <button className="glowy-button"></button>
    </div>

  );
}

export default App;
