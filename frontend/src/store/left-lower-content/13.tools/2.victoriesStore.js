// frontend\src\store\left-lower-content\13.tools\2.victoriesStore.js
import { create } from 'zustand';


// export const initialVictories = [
//   {
//     id: 1,
//     date: '2025-04-02',
//     who: 'Kayven',
//     milestones: 'Systematize Coaching Framework (now called Momentum OS).',
//     notes: 'Notes ',
//   },
//   {
//     id: 2,
//     date: '2025-04-03',
//     who: 'Kayven',
//     milestones: 'Systematize Client Delivery.',
//     notes: 'Notes  1',
//   },
//   {
//     id: 3,
//     date: '2025-04-03',
//     who: 'Kayven',
//     milestones: 'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
//     notes: 'Notes  2',
//   },
//   {
//     id: 4,
//     date: '2025-04-04',
//     who: 'Kayven',
//     milestones: 'Develop lead generation systems.',
//     notes: 'Notes  3',
//   },
//   {
//     id: 5,
//     date: '2025-04-05',
//     who: 'Kayven',
//     milestones: '1% Genius Version 3 Development.',
//     notes: 'Notes  4',
//   },
// ];

export const initialVictories = [
  {
    id: 1,
    date: '-',
    who: '-',
    milestones: '-',
    notes: '-',
  },
  {
    id: 2,
    date: '-',
    who: '-',
    milestones: '-',
    notes: '-',
  },
  {
    id: 3,
    date: '-',
    who: '-',
    milestones: '-',
    notes: '-',
  },
  {
    id: 4,
    date: '-',
    who: '-',
    milestones: '-',
    notes: '-',
  },
  {
    id: 5,
    date: '-',
    who: '-',
    milestones: '-',
    notes: '-',
  },
];


const useVictoriesStore = create((set) => ({
  victoriesTable: initialVictories,

  // Store the initial state when app loads
  baselineVictoriesTable: initialVictories,

  setBaselineVictoriesTable: (data) => set({ baselineVictoriesTable: data }),


  setVictoriesTable: (victories) => set({ victoriesTable: victories }),

  addIssuesTable: (victory) =>
    set((state) => ({
      victoriesTable: [...state.victoriesTable, victory],
    })),

  updateVictoriesTableField: (id, field, value) =>
    set((state) => ({
      victoriesTable: state.victoriesTable.map((victory) =>
        victory.id === id ? { ...victory, [field]: value } : victory
      ),
    })),

  pushVictoriesTable: (victory) =>
    set((state) => {
      const newVictory = {
        id: state.victoriesTable.length + 1,
        date: victory.date || '',     // date string (yyyy-mm-dd)
        who: victory.who,
        milestones: victory.milestones,
        notes: victory.notes,
      };
      return {
        victoriesTable: [...state.victoriesTable, newVictory],
      };
    }),

  loadIssuesTableFromAPI: (victories) =>
    set({ victoriesTable: victories }),
}));

export default useVictoriesStore;
