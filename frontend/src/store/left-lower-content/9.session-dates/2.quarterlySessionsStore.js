// frontend\src\store\left-lower-content\9.session-dates\2.quarterlySessionsStore.js
import { create } from 'zustand';

// const initialQuarterlySessionTrackerData = [
//   {
//     status: 'Completed',
//     quarter: 'Q1 2025',
//     meetingDate: 'January 20, 2025',
//     agenda: 'Strategic Planning & KPIs',
//     recap: 'Shared Q1 goals and budget updates',
//   },
//   {
//     status: 'Scheduled',
//     quarter: 'Q2 2025',
//     meetingDate: 'April 22, 2025',
//     agenda: 'Customer Retention Plans',
//     recap: 'To be added after session',
//   },
//   {
//     status: 'Pending',
//     quarter: 'Q3 2025',
//     meetingDate: 'July 15, 2025',
//     agenda: 'New Product Launch Discussion',
//     recap: 'To be added',
//   },
//   {
//     status: 'Upcoming',
//     quarter: 'Q4 2025',
//     meetingDate: 'October 17, 2025',
//     agenda: 'Annual Review & Strategy 2026',
//     recap: 'To be added',
//   },
// ];

const initialQuarterlySessionTrackerData = [
  {
    status: '-',
    quarter: '-',
    meetingDate: '-',
    agenda: '-',
    recap: '-',
  },
  {
    status: '-',
    quarter: '-',
    meetingDate: '-',
    agenda: '-',
    recap: '-',
  },
  {
    status: '-',
    quarter: '-',
    meetingDate: '-',
    agenda: '-',
    recap: '-',
  },
  {
    status: '-',
    quarter: '-',
    meetingDate: '-',
    agenda: '-',
    recap: '-',
  },
];


const useQuarterlySessionsStore = create((set) => ({
  sessions: initialQuarterlySessionTrackerData,
  setQuarterlySessions: (newData) => set({ sessions: newData }),
  addQuarterlySession: (newItem) =>
    set((state) => ({
      sessions: [...state.sessions, newItem],
    })),
  updateQuarterlySessionField: (index, field, value) =>
    set((state) => {
      const updated = [...state.sessions];
      updated[index][field] = value;
      return { sessions: updated };
    }),
  pushQuarterlySessions: (newItems) =>
    set((state) => ({
      sessions: [...state.sessions, ...newItems],
    })),
  loadQuarterlySessionsFromAPI: async () => {
    // Simulate API response
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve(initialQuarterlySessionTrackerData), 500)
    );
    set({ sessions: response });
  },
}));

export default useQuarterlySessionsStore;
