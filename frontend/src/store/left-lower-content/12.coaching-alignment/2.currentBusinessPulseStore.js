// frontend\src\store\left-lower-content\12.coaching-alignment\2.currentBusinessPulseStore.js
import { create } from 'zustand';

export const initialBusinessPulse = [
  {
    category: 'Strategic Clarity',
    rating: 1,
    notes: ['test', 'test'],
  },
  {
    category: 'Execution Discipline',
    rating: 'N/A',
    notes: [],
  },
  {
    category: 'Leadership & Team Health',
    rating: 'N/A',
    notes: [],
  },
];

const useBusinessPulseStore = create((set) => ({
  pulseItems: initialBusinessPulse,

  setPulseItems: (items) => set({ pulseItems: items }),

  updatePulseItem: (index, updatedItem) =>
    set((state) => {
      const updated = [...state.pulseItems];
      updated[index] = { ...updated[index], ...updatedItem };
      return { pulseItems: updated };
    }),

  resetPulseItems: () => set({ pulseItems: initialBusinessPulse }),
}));

export default useBusinessPulseStore;
