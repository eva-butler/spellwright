import useGameStore from '../state/useGameStore';

const IngredientList = () => {
  const ingredients = useGameStore((state) => state.ingredients);

  return (
    <div>
      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientList;
