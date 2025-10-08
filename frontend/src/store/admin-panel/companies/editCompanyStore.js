import { create } from 'zustand';

const allMonths = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December',
];

export const useEditCompanyStore = create((set, get) => ({
  company: {
    name: 'eDoc Innovations',
    quarters: {
      Q1: ['January', 'February'],
      Q2: ['April', 'May', 'June'],
      Q3: ['July', 'August'],
      Q4: ['October', 'November'],
    },
  },

  setCompanyName: (name) =>
    set((state) => ({
      company: { ...state.company, name },
    })),

  handleMonthAdd: (quarter, month) => {
    if (!month) return;
    set((state) => ({
      company: {
        ...state.company,
        quarters: {
          ...state.company.quarters,
          [quarter]: [...state.company.quarters[quarter], month],
        },
      },
    }));
  },

  handleMonthRemove: (quarter, month) => {
    set((state) => ({
      company: {
        ...state.company,
        quarters: {
          ...state.company.quarters,
          [quarter]: state.company.quarters[quarter].filter((m) => m !== month),
        },
      },
    }));
  },

  getAvailableMonths: (currentQuarter) => {
    const { company } = get();
    const selectedInOtherQuarters = Object.entries(company.quarters)
      .filter(([q]) => q !== currentQuarter)
      .flatMap(([, months]) => months);

    return allMonths.filter((month) => !selectedInOtherQuarters.includes(month));
  },
}));
