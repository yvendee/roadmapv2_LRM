// frontend\src\store\left-lower-content\13.tools\3.bigIdeasStore.js
import { create } from 'zustand';


// export const initialBigIdeas = [
//   {
//     id: 1,
//     date: '2025-04-02',               
//     who: 'Kayven',                    
//     description: 'Systematize Coaching Framework (now called Momentum OS).',
//     impact: 'High',              
//     when: '2025-04-02',                
//     evaluator: 'Team A',     
//     comments: 'Notes',        
//   },
//   {
//     id: 2,
//     date: '2025-04-03',
//     who: 'Kayven',
//     description: 'Systematize Client Delivery.',
//     impact: 'Medium',
//     when: '2025-04-02',
//     evaluator: 'Team A',
//     comments: 'Notes 1',
//   },
//   {
//     id: 3,
//     date: '2025-04-03',
//     who: 'Kayven',
//     description: 'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
//     impact: 'High',
//     when: '2025-04-02',
//     evaluator: 'Team B',
//     comments: 'Notes 2',
//   },
//   {
//     id: 4,
//     date: '2025-04-04',
//     who: 'Kayven',
//     description: 'Develop lead generation systems.',
//     impact: 'Medium',
//     when: '2025-04-02',
//     evaluator: 'Team B',
//     comments: 'Notes 3',
//   },
//   {
//     id: 5,
//     date: '2025-04-05',
//     who: 'Kayven',
//     description: '1% Genius Version 3 Development.',
//     impact: 'High',
//     when: '2025-04-02',
//     evaluator: 'Team C',
//     comments: 'Notes 4',
//   },
// ];

export const initialBigIdeas = [
  {
    id: 1,
    date: '-',
    who: '-',
    description: '-',
    impact: '-',
    when: '-',
    evaluator: '-',
    comments: '-',
  },
  {
    id: 2,
    date: '-',
    who: '-',
    description: '-',
    impact: '-',
    when: '-',
    evaluator: '-',
    comments: '-',
  },
  {
    id: 3,
    date: '-',
    who: '-',
    description: '-',
    impact: '-',
    when: '-',
    evaluator: '-',
    comments: '-',
  },
  {
    id: 4,
    date: '-',
    who: '-',
    description: '-',
    impact: '-',
    when: '-',
    evaluator: '-',
    comments: '-',
  },
  {
    id: 5,
    date: '-',
    who: '-',
    description: '-',
    impact: '-',
    when: '-',
    evaluator: '-',
    comments: '-',
  },
];


const useBigIdeasStore = create((set) => ({
  bigIdeasTable: initialBigIdeas,

  // Store the initial state when app loads
  baselineBigIdeasTable: initialBigIdeas,

  setBaselineBigIdeasTable: (data) => set({ baselineBigIdeasTable: data }),


  setBigIdeasTable: (bigIdeas) => set({ bigIdeasTable: bigIdeas }),

  addBigIdeasTable: (bigIdea) =>
    set((state) => ({
      bigIdeasTable: [...state.bigIdeasTable, bigIdea],
    })),

  updateBigIdeasTableField: (id, field, value) =>
    set((state) => ({
      bigIdeasTable: state.bigIdeasTable.map((bigIdea) =>
        bigIdea.id === id ? { ...bigIdea, [field]: value } : bigIdea
      ),
    })),

  pushBigIdeasTable: (bigIdea) =>
    set((state) => {
      const newBigIdea = {
        id: state.bigIdeasTable.length + 1,
        date: bigIdea.date || '',     // date string (yyyy-mm-dd)
        who: bigIdea.who,
        description: bigIdea.description,
        impact: bigIdea.impact,
        when: bigIdea.when,
        evaluator: bigIdea.evaluator,
        comments: bigIdea.comments,
      };
      return {
        bigIdeasTable: [...state.bigIdeasTable, newBigIdea],
      };
    }),

  loadBigIdeasTableFromAPI: (bigIdeas) =>
    set({ bigIdeasTable: bigIdeas }),
}));

export default useBigIdeasStore;
