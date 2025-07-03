// frontend\src\store\left-lower-content\2.one-page-strategic-plan\1.strategicDriversStore.js
import { create } from 'zustand';

export const initialStrategicDrivers = [
  {
    id: 1,
    title: 'Solution Innovation',
    description:
      'Focuses on productization, technology, and data integration to create repeatable, scalable solutions that deliver on the brand promise.',
  },
  {
    id: 2,
    title: 'Talent Leadership',
    description:
      'Centers on elite coach acquisition and building a high-performance culture, ensuring the team can execute the innovative solutions.',
  },
  {
    id: 3,
    title: 'Exceptional Delivery',
    description:
      'Emphasizes structured processes and achieving 10/10 ratings, turning the talent and solutions into concrete results.',
  },
  {
    id: 4,
    title: 'Market Dominance',
    description:
      'Leverages strategic alliances and builds a referral engine to expand reach, which then cycles back to reinforce the brand promise.',
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
}));

export default useStrategicDriversStore;
