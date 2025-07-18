// frontend\src\store\left-lower-content\4.scoreboard\2.companyTractionCardsStore.js
import { create } from 'zustand';

// 🟩 Initial data
export const initialCompanyTraction = [
  { label: 'Q1', percent: 0 },
  { label: 'Q2', percent: 0 },
  { label: 'Q3', percent: 0 },
  { label: 'Q4', percent: 0 },
];

// 🧠 Zustand store
const useCompanyTractionStore = create((set) => ({
  quarters: initialCompanyTraction,

  setQuarters: (newData) => set({ quarters: newData }),

  updateQuarter: (index, updated) =>
    set((state) => {
      const updatedQuarters = [...state.quarters];
      updatedQuarters[index] = { ...updatedQuarters[index], ...updated };
      return { quarters: updatedQuarters };
    }),

  resetQuarters: () => set({ quarters: initialCompanyTraction }),
}));

export default useCompanyTractionStore;
