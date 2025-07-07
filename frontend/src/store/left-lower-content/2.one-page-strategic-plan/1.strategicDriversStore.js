// frontend\src\store\left-lower-content\2.one-page-strategic-plan\1.strategicDriversStore.js
import { create } from 'zustand';


// export const initialStrategicDrivers = [
//   {
//     id: 1,
//     title: 'Solution Innovation',
//     description:
//       'Focuses on productization, technology, and data integration to create repeatable, scalable solutions that deliver on the brand promise.',
//     kpi: 'Launch 2 scalable products',
//     status: 'Tracking',
//   },
//   {
//     id: 2,
//     title: 'Talent Leadership',
//     description:
//       'Centers on elite coach acquisition and building a high-performance culture, ensuring the team can execute the innovative solutions.',
//     kpi: 'Hire 5 elite coaches',
//     status: 'Behind',
//   },
//   {
//     id: 3,
//     title: 'Exceptional Delivery',
//     description:
//       'Emphasizes structured processes and achieving 10/10 ratings, turning the talent and solutions into concrete results.',
//     kpi: 'Achieve 90% 10/10 ratings',
//     status: 'At Risk',
//   },
//   {
//     id: 4,
//     title: 'Market Dominance',
//     description:
//       'Leverages strategic alliances and builds a referral engine to expand reach, which then cycles back to reinforce the brand promise.',
//     kpi: 'Grow referral traffic by 30%',
//     status: 'Paused',
//   },
// ];

export const initialStrategicDrivers = [
  {
    id: 1,
    title: '-',
    description: '-',
    kpi: '-',
    status: '-',
  },
  {
    id: 2,
    title: '-',
    description: '-',
    kpi: '-',
    status: '-',
  },
  {
    id: 3,
    title: '-',
    description: '-',
    kpi: '-',
    status: '-',
  },
  {
    id: 4,
    title: '-',
    description: '-',
    kpi: '-',
    status: '-',
  },
];


const useStrategicDriversStore = create((set) => ({
  strategicDrivers: initialStrategicDrivers,
  setStrategicDrivers: (drivers) => set({ strategicDrivers: drivers }),
  addStrategicDriver: (driver) =>
    set((state) => ({
      strategicDrivers: [...state.strategicDrivers, driver],
    })),
  updateDriverField: (id, field, value) =>
    set((state) => ({
      strategicDrivers: state.strategicDrivers.map((driver) =>
        driver.id === id ? { ...driver, [field]: value } : driver
      ),
    })),
  pushStrategicDriver: (driver) =>
    set((state) => {
      const newDriver = {
        id: state.strategicDrivers.length + 1,
        title: driver.title,
        description: driver.description,
        kpi: driver.kpi,
        status: driver.status,
      };
      return {
        strategicDrivers: [...state.strategicDrivers, newDriver],
      };
    }),
  loadStrategicDriversFromAPI: (drivers) => set({ strategicDrivers: drivers }),
}));


export default useStrategicDriversStore;
