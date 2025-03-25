import useGameStore from '../state/useGameStore';

const LevelSelect = () => {
  const setSelectedLevel = useGameStore((state) => state.setSelectedLevel);
  const unlockIngredient = useGameStore((state) => state.unlockIngredient);

  const levels = [
    { id: 1, name: 'Level 1: Whispercap', reward: 'Whispercap' },
    { id: 2, name: 'Level 2: Echo Dust', reward: 'Echo Dust' },
    { id: 3, name: 'Level 3: Azure Root', reward: 'Azure Root' },
  ];

  const handleClick = (level) => {
    setSelectedLevel(level);
    unlockIngredient(level.reward);
  };

  return (
    <div>
      <h2>Level Select</h2>
      {levels.map((level) => (
        <button key={level.id} onClick={() => handleClick(level)}>
          {level.name}
        </button>
      ))}
    </div>
  );
};

export default LevelSelect;
