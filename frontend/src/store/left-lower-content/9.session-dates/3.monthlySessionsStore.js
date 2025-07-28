// frontend\src\store\left-lower-content\9.session-dates\3.monthlySessionsStore.js
import { create } from 'zustand';

// const initialMonthlySessionTrackerData = [
//   {
//     status: 'Done',
//     month: 'January',
//     date: '2025-01-10',
//     agenda: 'Review January goals and targets',
//     recap: 'All targets met. Positive team performance.',
//   },
//   {
//     status: 'Pending',
//     month: 'February',
//     date: '2025-02-14',
//     agenda: 'Mid-Q1 Alignment & Budget Discussion',
//     recap: 'To be conducted.',
//   },
//   {
//     status: 'New',
//     month: 'March',
//     date: '2025-03-20',
//     agenda: 'Client Feedback Analysis',
//     recap: 'Preparation ongoing.',
//   },
// ];

const initialMonthlySessionTrackerData = [
  {
    status: '-',
    month: '-',
    date: '-',
    agenda: '-',
    recap: '-',
  },
  {
    status: '-',
    month: '-',
    date: '-',
    agenda: '-',
    recap: '-',
  },
  {
    status: '-',
    month: '-',
    date: '-',
    agenda: '-',
    recap: '-',
  },
];


const useMonthlySessionsStore = create((set) => ({
  monthlySessions: initialMonthlySessionTrackerData,
  setMonthlySessions: (newData) => set({ monthlySessions: newData }),
  addMonthlySession: (newItem) =>
    set((state) => ({
      monthlySessions: [...state.monthlySessions, newItem],
    })),
  updateMonthlySessionField: (index, field, value) =>
    set((state) => {
      const updated = [...state.monthlySessions];
      updated[index][field] = value;
      return { monthlySessions: updated };
    }),
  pushMonthlySessions: (newItems) =>
    set((state) => ({
      monthlySessions: [...state.monthlySessions, ...newItems],
    })),
  loadMonthlySessionsFromAPI: async () => {
    // Simulated API delay and response
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve(initialMonthlySessionTrackerData), 500)
    );
    set({ monthlySessions: response });
  },
}));

export default useMonthlySessionsStore;
