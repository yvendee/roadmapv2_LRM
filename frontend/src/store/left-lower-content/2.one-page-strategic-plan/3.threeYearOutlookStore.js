// frontend\src\store\left-lower-content\2.one-page-strategic-plan\3.threeYearOutlookStore.js
import { create } from 'zustand';

export const initialOutlooks = [
    { id: 1, year: '2026', value: 'Revenue of $4 Million' },
    { id: 2, year: '2027', value: 'Revenue of $7 Million' },
    { id: 3, year: '2028', value: 'Revenue of $9 Million' },
];

// export const initialOutlooks = [
//     { year: '-', value: '-' },
//     { year: '-', value: '-' },
//     { year: '-', value: '-' },
// ];
  

const useThreeYearOutlookStore = create((set) => ({
  outlooks: initialOutlooks,
  setOutlooks: (data) => set({ outlooks: data }),
  updateOutlook: (year, value) =>
    set((state) => ({
      outlooks: state.outlooks.map((o) =>
        o.year === year ? { ...o, value } : o
      ),
    })),
  pushOutlook: (item) =>
    set((state) => ({
      outlooks: [...state.outlooks, item],
    })),
}));

export default useThreeYearOutlookStore;
