import { create } from 'zustand';

export const initialCompanyTraction = {
  Q1: [
    {
      id: 1,
      who: 'Maricar',
      collaborator: 'Maricar',
      description:
        'Develop $8,000 in new monthly revenue - one on one or cohort. Use the references and leads we have.',
      progress: '5%',
      annualPriority: 'Develop lead generation systems',
      dueDate: '03/31/2025',
      rank: '1',
      comment: [],  // Initialize as an empty array for multiple comments
    },
  ],
  Q2: [
    {
      id: 2,
      who: 'Maricar',
      collaborator: 'Maricar',
      description:
        'Continue with developing lead generation system but using LinkedIn post and Chuck’s website',
      progress: '0%',
      annualPriority: 'Develop lead generation systems',
      dueDate: 'Click to set date',
      rank: '',
      comment: [],  // Initialize as an empty array for multiple comments
    },
    {
      id: 3,
      who: 'Maricar',
      collaborator: 'None',
      description: 'Use Apollo with Arlene',
      progress: '0%',
      annualPriority: 'Develop lead generation systems',
      dueDate: 'Click to set date',
      rank: '',
      comment: [],  // Initialize as an empty array for multiple comments
    },
  ],
  Q3: [],
  Q4: [],
};

const useCompanyTractionStore = create((set) => ({
  companyTraction: initialCompanyTraction,

  setCompanyTraction: (data) => set({ companyTraction: data }),

  addCompanyTraction: (quarter, item) =>
    set((state) => ({
      companyTraction: {
        ...state.companyTraction,
        [quarter]: [...state.companyTraction[quarter], item],
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

  // Action to append a new comment to the array
  updateComment: (quarter, id, newComment) =>
    set((state) => ({
      companyTraction: {
        ...state.companyTraction,
        [quarter]: state.companyTraction[quarter].map((row) =>
          row.id === id
            ? { ...row, comment: [...row.comment, newComment] } // Append the new comment
            : row
        ),
      },
    })),
}));

export default useCompanyTractionStore;
