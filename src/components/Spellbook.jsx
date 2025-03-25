import useGameStore from '../state/useGameStore';

const Spellbook = () => {
  const potions = useGameStore((state) => state.potions);

  return (
    <div>
      <h2>Spellbook</h2>
      {potions.length === 0 ? (
        <p>No potions discovered yet.</p>
      ) : (
        <ul>
          {potions.map((potion, index) => (
            <li key={index}>{potion}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Spellbook;
