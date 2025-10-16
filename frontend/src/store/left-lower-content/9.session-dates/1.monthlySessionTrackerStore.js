// frontend\src\store\left-lower-content\9.session-dates\1.monthlySessionTrackerStore.js
import { create } from 'zustand';
import { isSameMonth } from 'date-fns';

// export const initialMonthlySessionTrackerData = [
//   { date: '2025-07-01', status: 'done', details: 'Strategy alignment' },
//   { date: '2025-07-15', status: 'pending', details: 'KPI review' },
//   { date: '2025-07-25', status: 'new', details: 'Planning' },
//   { date: '2025-08-05', status: 'pending', details: 'Forecasting' },
// ];

export const initialMonthlySessionTrackerData = [
  { date: '-', status: '-', details: '-' },
  { date: '-', status: '-', details: '-' },
  { date: '-', status: '-', details: '-' },
  { date: '-', status: '-', details: '-' },
];


const useMonthlySessionTrackerStore = create((set, get) => ({
  allSessions: initialMonthlySessionTrackerData,
  currentMonth: new Date(),
  setCurrentMonth: (date) => set({ currentMonth: date }),
  setAllSessions: (sessions) => set({ allSessions: sessions }),
  getSessionsForMonth: (date) =>
    get().allSessions.filter((item) =>
      item.date !== '-' && isSameMonth(new Date(item.date), date)
    ),
}));




export default useMonthlySessionTrackerStore;
