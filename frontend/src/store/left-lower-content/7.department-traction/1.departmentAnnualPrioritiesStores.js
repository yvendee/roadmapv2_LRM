// frontend\src\store\left-lower-content\7.department-traction\1.departmentAnnualPrioritiesStores.js
import { create } from 'zustand';


// export const initialDepartmentAnnualPriorities = [
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

export const initialDepartmentAnnualPriorities = [
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


const useDepartmentAnnualPrioritiesStore = create((set) => ({
  departmentAnnualPriorities: initialDepartmentAnnualPriorities,

  // ✅ New baseline state for "original" untouched data
  baselineDepartmentAnnualPriorities: initialDepartmentAnnualPriorities,

  // ✅ Function to store the original state
  setBaselineDepartmentAnnualPriorities: (data) =>
    set({ baselineDepartmentAnnualPriorities: data }),

  
  setDepartmentAnnualPriorities: (drivers) => set({ departmentAnnualPriorities: drivers }),
  addDepartmentAnnualAnnualPriorities: (driver) =>
    set((state) => ({
        departmentAnnualPriorities: [...state.departmentAnnualPriorities, driver],
    })),
  updateAnnualPrioritiesField: (id, field, value) =>
    set((state) => ({
        departmentAnnualPriorities: state.departmentAnnualPriorities.map((driver) =>
        driver.id === id ? { ...driver, [field]: value } : driver
      ),
    })),
  pushDepartmentAnnualPriorities: (driver) =>
    set((state) => {
      const newDriver = {
        id: state.departmentAnnualPriorities.length + 1,
        title: driver.title,
        description: driver.description,
        kpi: driver.kpi,
        status: driver.status,
      };
      return {
        departmentAnnualPriorities: [...state.departmentAnnualPriorities, newDriver],
      };
    }),
  loadDepartmentAnnualPrioritiesFromAPI: (drivers) => set({ departmentAnnualPriorities: drivers }),
}));


export default useDepartmentAnnualPrioritiesStore;
