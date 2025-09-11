// frontend\src\store\left-lower-content\11.coaching-checklist\1.projectProgressAndToolsStore.js
import { create } from 'zustand';

// 🟦 Initial Mockup Data
export const initialProjectProgressData = {
  completedItems: 0,
  totalItems: 0,
  nextRecommendedTools: [
    { id: 1, name: 'SWOT Analysis Tool' },
    { id: 2, name: 'Customer Journey Mapper' },
    { id: 3, name: 'Competitor Benchmarking Grid' },
    { id: 4, name: 'SMART Goals Planner' },
  ],
};

const useProjectToolsStore = create((set) => ({
  completedItems: initialProjectProgressData.completedItems,
  totalItems: initialProjectProgressData.totalItems,
  nextRecommendedTools: initialProjectProgressData.nextRecommendedTools,

  // 🔧 Actions
  setCompletedItems: (count) => set({ completedItems: count }),
  setTotalItems: (count) => set({ totalItems: count }),
  setNextRecommendedTools: (tools) => set({ nextRecommendedTools: tools }),

  // Optionally reset to mockup
  resetProgressData: () => set({ ...initialProjectProgressData }),
}));

export default useProjectToolsStore;
