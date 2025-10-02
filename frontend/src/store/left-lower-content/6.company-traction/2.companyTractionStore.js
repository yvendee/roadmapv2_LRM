// frontend\src\store\left-lower-content\6.company-traction\2.companyTractionStore.js
import { create } from 'zustand';

// export const initialCompanyTraction = {
//   Q1: [
//     {
//       id: 1,
//       who: 'Maricar',
//       collaborator: 'Maricar',
//       description: 'Build landing page',
//       progress: '5%',
//       annualPriority: 'Develop lead generation systems',
//       dueDate: '03-31-2025',
//       rank: '1',
//       comment: [
//         {
//           author: 'Maricar',
//           message: 'This is a test comment.',
//           posted: '26 June 2025',
//         },
//         {
//           author: 'John',
//           message: 'Great work on this!',
//           posted: '27 June 2025',
//         },
//       ],
//     },
//   ],
//   Q2: [
//     {
//       id: 1,
//       who: 'Maricar',
//       collaborator: 'Maricar',
//       description: 'Launch marketing campaign',
//       progress: '0%',
//       annualPriority: 'Develop lead generation systems',
//       dueDate: 'Click to set date',
//       rank: '2',
//       comment: [
//         {
//           author: 'Maricar',
//           message: 'This is a test comment.',
//           posted: '26 June 2025',
//         },
//         {
//           author: 'John',
//           message: 'Great work on this!',
//           posted: '27 June 2025',
//         },
//       ],
//     },

//     {
//       id: 2,
//       who: 'Chuck',
//       collaborator: 'Maricar',
//       description: 'Build landing page',
//       progress: '5%',
//       annualPriority: 'Develop lead generation systems',
//       dueDate: '04-19-2025',
//       rank: '2',
//       comment: [
//         {
//           author: 'Maricar',
//           message: 'This is a test comment.',
//           posted: '26 June 2025',
//         },
//         {
//           author: 'John',
//           message: 'Great work on this!',
//           posted: '27 June 2025',
//         },
//       ],
//     },
//   ],
//   Q3: [],
//   Q4: [],
// };


export const initialCompanyTraction = {
  Q1: [],
  Q2: [],
  Q3: [],
  Q4: [],
};

const useCompanyTractionStore = create((set) => ({
  companyTraction: initialCompanyTraction,

  // Store the initial state when app loads
  baselineCompanyTraction: initialCompanyTraction,

  setBaselineCompanyTraction: (data) => set({ baselineCompanyTraction: data }),

  setCompanyTraction: (data) => set({ companyTraction: data }),

  // addCompanyTraction: (quarter, item) =>
  //   set((state) => ({
  //     companyTraction: {
  //       ...state.companyTraction,
  //       [quarter]: [...state.companyTraction[quarter], item],
  //     },
  //   })),

  addCompanyTraction: (quarter, item) =>
    set((state) => {
      const existing = Array.isArray(state.companyTraction[quarter])
        ? state.companyTraction[quarter]
        : [];
      return {
        companyTraction: {
          ...state.companyTraction,
          [quarter]: [...existing, item],
        },
      };
    }),
  

  updateCompanyTractionField: (quarter, id, field, value) =>
    set((state) => ({
      companyTraction: {
        ...state.companyTraction,
        [quarter]: state.companyTraction[quarter].map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        ),
      },
    })),

  updateComment: (quarter, id, newComment) =>
    set((state) => ({
      companyTraction: {
        ...state.companyTraction,
        [quarter]: state.companyTraction[quarter].map((row) =>
          row.id === id
            ? {
                ...row,
                comment: [
                  ...row.comment,
                  {
                    author: newComment.author,
                    message: newComment.message,
                    posted: new Date().toLocaleDateString(),
                  },
                ],
              }
            : row
        ),
      },
    })),

  updateCompanyTractionField: (quarter, id, field, value) =>
    set((state) => ({
      companyTraction: {
        ...state.companyTraction,
        [quarter]: state.companyTraction[quarter].map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        ),
      },
    })),
    

  deleteComment: (quarter, id, commentIndex) =>
    set((state) => ({
      companyTraction: {
        ...state.companyTraction,
        [quarter]: state.companyTraction[quarter].map((row) =>
          row.id === id
            ? {
                ...row,
                comment: row.comment.filter((_, index) => index !== commentIndex),
              }
            : row
        ),
      },
    })),
}));

export default useCompanyTractionStore;
