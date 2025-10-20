// frontend\src\store\left-lower-content\2.one-page-strategic-plan\6.fourDecisionsStore.js
import { create } from 'zustand';


export const initialFourDecisions = [
  { header1: 'description', header2: 'orig', header3: 'q1', header4: 'q2', header5: 'q3', header6: 'q4' },
  { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 1 }
];

const useFourDecisions = create((set) => ({
  fourDecisions: initialFourDecisions,
  setFourDecisions: (data) => set({ fourDecisions: data }),
  pushFourDecisions: (item) =>
    set((state) => ({
      fourDecisions: [...state.fourDecisions, item],
    })),
  removeFourDecisions: (id) =>
    set((state) => ({
      fourDecisions: state.fourDecisions.filter(
        (item, index) => index === 0 || item.id !== id // preserve header row
      ),
    })),
}));


export default useFourDecisions;
