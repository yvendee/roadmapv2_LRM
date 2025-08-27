// frontend\src\store\layout\companyFilterStore.js
import { create } from 'zustand';

// export const useCompanyFilterStore = create((set) => ({
//   options: [
//     'Chuck Gulledge Advisors, LLC', 
//     'Collins Credit Union', 
//     'IH MVCU', 
//     'Ironclad',
//     'Seneca', 
//     'Texans Credit Union', 
//     'Kolb Grading'
//   ],
//   selected: 'Chuck Gulledge Advisors, LLC',
//   setSelected: (value) => set({ selected: value }),
// }));

export const useCompanyFilterStore = create((set) => ({
  options: ['No organization found'],
  selected: 'No organization found',
  setSelected: (value) => set({ selected: value }),
}));
