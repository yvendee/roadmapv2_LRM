// frontend\src\store\left-lower-content\13.tools\1.issuesStore.js
import { create } from 'zustand';

// Issue	Description	Date logged	Who	Resolution	Date resolved
export const initialAnnualPriorities = [
  {
    id: 1,
    issueName: 'System Issue 1',
    description:
      'Systematize Coaching Framework (now called Momentum OS).',
    status: '100.00%',
    dateLogged: '03-31-2025',
    who: 'Kayven',
    resolution: 'resolution here',
    dateResolved: '04-02-2025'
  },
  {
    id: 2,
    issueName: 'System Issue 2',
    description:
      'Systematize Client Delivery.',
    status: '83.33%',
    dateLogged: '03-29-2025',
    who: 'Kayven',
    resolution: 'resolution here 1',
    dateResolved: '04-03-2025'
  },
  {
    id: 3,
    issueName: 'System Issue 2',
    description:
      'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
    status: '0.00%',
    dateLogged: '03-28-2025',
    who: 'Kayven',
    resolution: 'resolution here 2',
    dateResolved: '04-03-2025'
  },
  {
    id: 4,
    issueName: 'System Issue 3',
    description:
      'Develop lead generation systems.',
    status: '50.00%',
    dateLogged: '03-27-2025',
    who: 'Kayven',
    resolution: 'resolution here 3',
    dateResolved: '04-04-2025'
  },
  {
    id: 5,
    issueName: 'System Issue 4',
    description:
      '1% Genius Version 3 Development.',
    status: '50.00%',
    dateLogged: '03-26-2025',
    who: 'Kayven',
    resolution: 'resolution here 4',
    dateResolved: '04-05-2025'
  },
];

// export const initialAnnualPriorities = [
//   {
//     id: 1,
//     description: '-',
//     status: '-',
//   },
//   {
//     id: 2,
//     description: '-',
//     status: '-',
//   },
//   {
//     id: 3,
//     description: '-',
//     status: '-',
//   },
//   {
//     id: 4,
//     description: '-',
//     status: '-',
//   },
//   {
//     id: 5,
//     description: '-',
//     status: '-',
//   },
// ];


const useAnnualPrioritiesStore = create((set) => ({
  annualPriorities: initialAnnualPriorities,
  setAnnualPriorities: (drivers) => set({ annualPriorities: drivers }),
  addAnnualPriorities: (driver) =>
    set((state) => ({
      annualPriorities: [...state.annualPriorities, driver],
    })),
  updateAnnualPrioritiesField: (id, field, value) =>
    set((state) => ({
      annualPriorities: state.annualPriorities.map((driver) =>
        driver.id === id ? { ...driver, [field]: value } : driver
      ),
    })),
  pushAnnualPriorities: (driver) =>
    set((state) => {
      const newDriver = {
        id: state.annualPriorities.length + 1,
        title: driver.title,
        description: driver.description,
        kpi: driver.kpi,
        status: driver.status,
      };
      return {
        annualPriorities: [...state.annualPriorities, newDriver],
      };
    }),
  loadAnnualPrioritiesFromAPI: (drivers) => set({ annualPriorities: drivers }),
}));


export default useAnnualPrioritiesStore;
