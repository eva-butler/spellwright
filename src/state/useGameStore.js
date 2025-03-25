import { create } from 'zustand';

const useGameStore = create((set) => ({
  ingredients: [],
  potions: [],
  selectedLevel: null,

  unlockIngredient: (ingredient) =>
    set((state) => ({
      ingredients: [...new Set([...state.ingredients, ingredient])],
    })),

  addPotion: (potion) =>
    set((state) => ({
      potions: [...state.potions, potion],
    })),

  setSelectedLevel: (level) => set({ selectedLevel: level }),
}));

export default useGameStore;
