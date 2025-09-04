// frontend\src\store\left-lower-content\6.company-traction\1.annualPrioritiesStore.js
import { create } from 'zustand';


// export const initialAnnualPriorities = [
//   {
//     id: 1,
//     description:
//       'Systematize Coaching Framework (now called Momentum OS).',
//     status: '100.00%',
//   },
//   {
//     id: 2,
//     description:
//       'Systematize Client Delivery.',
//     status: '83.33%',
//   },
//   {
//     id: 3,
//     description:
//       'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
//     status: '0.00%',
//   },
//   {
//     id: 4,
//     description:
//       'Develop lead generation systems.',
//     status: '50.00%',
//   },
//   {
//     id: 5,
//     description:
//       '1% Genius Version 3 Development.',
//     status: '50.00%',
//   },
// ];

export const initialAnnualPriorities = [
  {
    id: 1,
    description: '-',
    status: '-',
  },
  {
    id: 2,
    description: '-',
    status: '-',
  },
  {
    id: 3,
    description: '-',
    status: '-',
  },
  {
    id: 4,
    description: '-',
    status: '-',
  },
  {
    id: 5,
    description: '-',
    status: '-',
  },
];


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
