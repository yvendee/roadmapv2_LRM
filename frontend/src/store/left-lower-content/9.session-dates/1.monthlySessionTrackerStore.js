// frontend\src\store\left-lower-content\9.session-dates\1.monthlySessionTrackerStore.js
import { create } from 'zustand';
import { isSameMonth } from 'date-fns';

export const initialMonthlySessionTrackerData = [
  { date: '2025-07-01', status: 'done', details: 'Strategy alignment' },
  { date: '2025-07-15', status: 'pending', details: 'KPI review' },
  { date: '2025-07-25', status: 'new', details: 'Planning' },
  { date: '2025-08-05', status: 'pending', details: 'Forecasting' },
];

const useMonthlySessionTrackerStore = create((set) => ({
  allSessions: initialMonthlySessionTrackerData,
  currentMonth: new Date(),
  setCurrentMonth: (date) => set({ currentMonth: date }),
  setAllSessions: (sessions) => set({ allSessions: sessions }),  // ADD THIS
  getSessionsForMonth: (date) =>
    initialMonthlySessionTrackerData.filter((item) =>
      isSameMonth(new Date(item.date), date)
    ),
}));



export default useMonthlySessionTrackerStore;
