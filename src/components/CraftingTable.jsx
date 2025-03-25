import { useState } from 'react';
import useGameStore from '../state/useGameStore';

const CraftingTable = () => {
  const ingredients = useGameStore((state) => state.ingredients);
  const addPotion = useGameStore((state) => state.addPotion);
  const [selected, setSelected] = useState([]);

  const knownPotions = {
    'Whispercap+Echo Dust+Azure Root': 'Potion of Echoes',
  };

  const toggleSelect = (ingredient) => {
    setSelected((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const tryBrew = () => {
    const comboKey = selected.sort().join('+');
    const potion = knownPotions[comboKey];
    if (potion) {
      addPotion(potion);
      alert(`You brewed: ${potion}`);
    } else {
      alert('Nothing happened...');
    }
    setSelected([]);
  };

  return (
    <div>
      <h2>Crafting Table</h2>
      <div>
        {ingredients.map((item) => (
          <button
            key={item}
            onClick={() => toggleSelect(item)}
            style={{
              margin: '0.25rem',
              backgroundColor: selected.includes(item) ? '#aaa' : '#444',
              color: 'white',
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <button onClick={tryBrew}>Brew</button>
    </div>
  );
};

export default CraftingTable;
