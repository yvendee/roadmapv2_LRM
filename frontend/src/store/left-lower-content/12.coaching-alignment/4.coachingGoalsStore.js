// frontend/src/store/left-lower-content/12.coaching-alignment/4.coachingGoalsStore.js
import { create } from 'zustand';

// export const initialCoachingGoals = {
//   coachingGoalsItems: ['Test', 'test', 'Hello', 'World'],
// };

export const initialCoachingGoals = {
  coachingGoalsItems: [],
};

const useCoachingGoalsStore = create((set) => ({
  coachingGoalsItems: initialCoachingGoals.coachingGoalsItems,

  setCoachingGoalsItems: (items) => set({ coachingGoalsItems: items }),

  setCoachingGoals: (data) =>
    set({
      coachingGoalsItems: Array.isArray(data.coachingGoalsItems)
        ? data.coachingGoalsItems
        : initialCoachingGoals.coachingGoalsItems,
    }),

  updateCoachingGoalsItem: (index, updatedItem) =>
    set((state) => {
      const updated = [...state.coachingGoalsItems];
      updated[index] = updatedItem;
      return { coachingGoalsItems: updated };
    }),

  resetCoachingGoalsItem: () =>
    set({
      coachingGoalsItems: initialCoachingGoals.coachingGoalsItems,
    }),
}));

export default useCoachingGoalsStore;
