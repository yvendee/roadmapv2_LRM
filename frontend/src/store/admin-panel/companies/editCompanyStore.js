
// frontend\src\store\admin-panel\companies\editCompanyStore.js
import { create } from 'zustand';

// export const useEditCompanyStore = create((set) => ({
//   name: 'eDoc Innovations',
//   quarters: {
//     Q1: ['January', 'February'],
//     Q2: ['April', 'May', 'June'],
//     Q3: ['July', 'August'],
//     Q4: ['October', 'November'],
//   },
//   setName: (name) => set({ name }),
//   setQuarters: (quarters) => set({ quarters }),
// }));


export const useEditCompanyStore = create((set) => ({
  name: '',
  quarters: {
    Q1: ['January', 'February'],
    Q2: ['April', 'May', 'June'],
    Q3: ['July', 'August'],
    Q4: ['October', 'November'],
  },
  setName: (name) => set({ name }),
  setQuarters: (quarters) => set({ quarters }),
}));
