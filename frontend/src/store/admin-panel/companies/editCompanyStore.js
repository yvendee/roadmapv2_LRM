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
      company: {
        ...state.company,
        name,
      },
    })),

  handleMonthAdd: (quarter, month) => {
    if (!month) return;

    const { company } = get();
    const updatedQuarter = [...company.quarters[quarter], month];

    set({
      company: {
        ...company,
        quarters: {
          ...company.quarters,
          [quarter]: updatedQuarter,
        },
      },
    });
  },

  handleMonthRemove: (quarter, month) => {
    const { company } = get();
    const updatedQuarter = company.quarters[quarter].filter((m) => m !== month);

    set({
      company: {
        ...company,
        quarters: {
          ...company.quarters,
          [quarter]: updatedQuarter,
        },
      },
    });
  },

  getAvailableMonths: () => {
    const { company } = get();
    const selected = Object.values(company.quarters).flat();
    return allMonths.filter((m) => !selected.includes(m));
  },
}));
