// frontend\src\store\left-lower-content\8.who-what-when\1.whoWhatWhenStore.js
import { create } from 'zustand';

// export const initialWhoWhatWhen = [
//     {
//       id: 1,
//       date: '2025-03-31',
//       who: 'Maricar',
//       what: 'Systematize Coaching Framework (now called Momentum OS).',
//       deadline: '2025-03-31',
//       comments: 'approved',
//       status: '100.00%',
//     },
//     {
//       id: 2,
//       date: '2025-04-01',
//       who: 'Chuck',
//       what: 'Systematize Client Delivery.',
//       deadline: '2025-03-31',
//       comments: 'working',
//       status: '83.33%',
//     },
//     {
//       id: 3,
//       date: '2025-04-02',
//       who: 'Kayven',
//       what: 'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
//       deadline: '2025-03-31',
//       comments: 'pending',
//       status: '0.00%',
//     },
//     {
//       id: 4,
//       date: '2025-04-02',
//       who: 'John',
//       what: 'Develop lead generation systems.',
//       deadline: '2025-03-31',
//       comments: 'paused',
//       status: '50.00%',
//     },
//     {
//       id: 5,
//       date: '2025-04-02',
//       who: 'Grace',
//       what: '1% Genius Version 3 Development.',
//       deadline: '2025-03-31',
//       comments: 'waiting',
//       status: '50.00%',
//     },
//   ];
  

export const initialWhoWhatWhen = [
  {
    id: 1,
    date: '-',
    who: '-',
    what:'-',
    deadline:'-',
    comments: '-',
    status: '-',
  },
  {
    id: 2,
    date: '-',
    who: '-',
    what:'-',
    status: '-',
  },
  {
    id: 3,
    date: '-',
    who: '-',
    what:'-',
    deadline:'-',
    comments: '-',
    status: '-',
  },
  {
    id: 4,
    date: '-',
    who: '-',
    what:'-',
    deadline:'-',
    comments: '-',
    status: '-',
  },
  {
    id: 5,
    date: '-',
    who: '-',
    what:'-',
    deadline:'-',
    comments: '-',
    status: '-',
  },
];


const useWhoWhatWhenStore = create((set) => ({
  whoWhatWhen: initialWhoWhatWhen,

  // Store the initial state when app loads
  baselineWhoWhatWhen: initialWhoWhatWhen,

  setBaselineWhoWhatWhen: (data) => set({ baselineWhoWhatWhen: data }),

  setWhoWhatWhen: (drivers) => set({ whoWhatWhen: drivers }),
  addWhoWhatWhen: (driver) =>
    set((state) => ({
        whoWhatWhen: [...state.whoWhatWhen, driver],
    })),
  updateWhoWhatWhenField: (id, field, value) =>
    set((state) => ({
        whoWhatWhen: state.whoWhatWhen.map((driver) =>
        driver.id === id ? { ...driver, [field]: value } : driver
      ),
    })),
  pushWhoWhatWhen: (driver) =>
    set((state) => {
      const newDriver = {
        id: state.whoWhatWhen.length + 1,
        title: driver.title,
        date: driver.date,
        who: driver.who,
        what: driver.what,
        deadline: driver.deadline,
        comments: driver.comments,
        // kpi: driver.kpi,
        status: driver.status,
      };
      return {
        whoWhatWhen: [...state.whoWhatWhen, newDriver],
      };
    }),
  loadWhoWhatWhenFromAPI: (drivers) => set({ whoWhatWhen: drivers }),
}));


export default useWhoWhatWhenStore;
