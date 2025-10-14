// frontend\src\store\left-lower-content\9.session-dates\3.monthlySessionsStore.js
import { create } from 'zustand';

const initialMonthlySessionTrackerData = [
  {
    id: 1,
    status: 'Done',
    quarter: 'Q1 2025',
    meetingDate: '2025-01-20',
    agenda: { name: 'Strategic Planning & KPIs.pdf', url: 'https://example.com/agenda-q1.pdf' },
    recap: { name: 'Q1 Recap Summary.pdf', url: 'https://example.com/recap-q1.pdf' },
  },
  {
    id: 2,
    status: 'Done',
    quarter: 'Q2 2025',
    meetingDate: '2025-04-22',
    agenda: { name: 'Customer Retention Plans.pdf', url: 'https://example.com/agenda-q2.pdf' },
    recap: { name: 'Q2 Recap Summary.pdf', url: 'https://example.com/recap-q2.pdf' },
  },
  {
    id: 3,
    status: 'Pending',
    quarter: 'Q3 2025',
    meetingDate: '2025-07-15',
    agenda: { name: 'New Product Launch Discussion.pdf', url: 'https://example.com/agenda-q3.pdf' },
    recap: { name: '-', url: '' },
  },
  {
    id: 4,
    status: 'Pending',
    quarter: 'Q4 2025',
    meetingDate: '2025-10-17',
    agenda: { name: 'Annual Review & Strategy 2026.pdf', url: 'https://example.com/agenda-q4.pdf' },
    recap: { name: '-', url: '' },
  },
];


const useMonthlySessionsStore = create((set) => ({
  sessions: initialMonthlySessionTrackerData,

  setMonthlySessions: (newData) => set({ sessions: newData }),

  addMonthlySession: (newItem) =>
    set((state) => ({
      sessions: [...state.sessions, newItem],
    })),

  updateMonthlySessionField: (index, field, value) =>
    set((state) => {
      const updated = [...state.sessions];
      updated[index][field] = value;
      return { sessions: updated };
    }),

  pushMonthlySessions: (newItems) =>
    set((state) => ({
      sessions: [...state.sessions, ...newItems],
    })),

  loadMonthlySessionsFromAPI: async () => {
    // Replace this with actual API call if needed
    set({ sessions: initialMonthlySessionTrackerData });
  },
}));

export default useMonthlySessionsStore;
