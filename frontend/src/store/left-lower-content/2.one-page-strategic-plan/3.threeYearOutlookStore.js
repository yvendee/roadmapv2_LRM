// frontend\src\store\left-lower-content\2.one-page-strategic-plan\3.threeYearOutlookStore.js
import { create } from 'zustand';

export const initialOutlooks = [
  { id: 1, year: '-', value: '-' },
  { id: 2, year: '-', value: '-' },
  { id: 3, year: '-', value: '-' },
];

const useThreeYearOutlookStore = create((set) => ({
  outlooks: initialOutlooks,

  // Store the initial state when app loads
  baselineOutlooks: initialOutlooks,

  setBaselineOutlooks: (data) => set({ baselineOutlooks: data }),
  

  setOutlooks: (data) => set({ outlooks: data }),

  updateOutlook: (id, field, value) =>
    set((state) => ({
      outlooks: state.outlooks.map((o) =>
        o.id === id ? { ...o, [field]: value } : o
      ),
    })),

  pushOutlook: (item) =>
    set((state) => ({
      outlooks: [...state.outlooks, item],
    })),
}));

export default useThreeYearOutlookStore;
