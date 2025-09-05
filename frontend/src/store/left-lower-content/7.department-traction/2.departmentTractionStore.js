// frontend\src\store\left-lower-content\7.department-traction\1.departmentAnnualPrioritiesStore.js
import { create } from 'zustand';

// export const initialDepartmentTraction = {
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

export const initialDepartmentTraction = {
  Q1: [],
  Q2: [],
  Q3: [],
  Q4: [],
};

const useDepartmentTractionStore = create((set) => ({
  departmentTraction: initialDepartmentTraction,

  // Store the initial state when app loads
  baselineDepartmentTraction: initialDepartmentTraction,

  setBaselineDepartmentTraction: (data) => set({ baselineDepartmentTraction: data }),

  setDepartmentTraction: (data) => set({ departmentTraction: data }),

  addDepartmentTraction: (quarter, item) =>
    set((state) => ({
      departmentTraction: {
        ...state.departmentTraction,
        [quarter]: [...state.departmentTraction[quarter], item],
      },
    })),

  updateDepartmentTractionField: (quarter, id, field, value) =>
    set((state) => ({
      departmentTraction: {
        ...state.departmentTraction,
        [quarter]: state.departmentTraction[quarter].map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        ),
      },
    })),

  updateComment: (quarter, id, newComment) =>
    set((state) => ({
      departmentTraction: {
        ...state.departmentTraction,
        [quarter]: state.departmentTraction[quarter].map((row) =>
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

    updateDepartmentTractionField: (quarter, id, field, value) =>
    set((state) => ({
      departmentTraction: {
        ...state.departmentTraction,
        [quarter]: state.departmentTraction[quarter].map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        ),
      },
    })),
    

  deleteComment: (quarter, id, commentIndex) =>
    set((state) => ({
      departmentTraction: {
        ...state.departmentTraction,
        [quarter]: state.departmentTraction[quarter].map((row) =>
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

export default useDepartmentTractionStore;
