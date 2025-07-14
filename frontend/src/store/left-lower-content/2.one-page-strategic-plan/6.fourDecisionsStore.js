// frontend\src\store\left-lower-content\2.one-page-strategic-plan\6.fourDecisionsStore.js
import { create } from 'zustand';


export const initialFourDecisions = [
  { description: 'Budget Allocation', orig: 'x', q1: 'x', q2: '✓', q3: 'x', q4: '✓', id: 1 },
  { description: 'Product Launch', orig: '✓', q1: '✓', q2: 'x', q3: '✓', q4: 'x', id: 2 },
  { description: 'Market Research', orig: 'x', q1: 'x', q2: 'x', q3: '✓', q4: '✓', id: 3 },
  { description: 'Customer Feedback', orig: '✓', q1: '✓', q2: 'x', q3: 'x', q4: '✓', id: 4 },
  { description: 'Team Collaboration', orig: 'x', q1: 'x', q2: '✓', q3: 'x', q4: 'x', id: 5 },
  { description: 'Sales Strategy', orig: '✓', q1: 'x', q2: 'x', q3: '✓', q4: '✓', id: 6 },
  { description: 'Quality Control', orig: 'x', q1: '✓', q2: '✓', q3: 'x', q4: 'x', id: 7 },
  { description: 'Employee Engagement', orig: '✓', q1: '✓', q2: 'x', q3: '✓', q4: 'x', id: 8 }
];

// export const initialFourDecisions = [
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 1 },
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 2 },
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 3 },
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 4 },
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 5 },
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 6 },
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 7 },
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 8 }
// ];

const useFourDecisions = create((set) => ({
    fourDecisions: initialFourDecisions,
    setFourDecisions: (data) => set({ fourDecisions: data }),
    pushFourDecisions: (item) =>
    set((state) => ({
      fourDecisions: [...state.fourDecisions, item],
    })),
}));

export default useFourDecisions;
