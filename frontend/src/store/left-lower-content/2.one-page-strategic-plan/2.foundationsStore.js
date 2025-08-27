// frontend\src\store\left-lower-content\2.one-page-strategic-plan\2.foundationsStore.js
import { create } from 'zustand';

// export const initialFoundations = [
//   {
//     id: 1,
//     title: 'Our Aspiration',
//     content: '"To be renowned as the premier coaching organization that transforms how companies achieve their optimal exits."',
//   },
//   {
//     id: 2,
//     title: 'Our Purpose / Mission',
//     content: `Our purpose is:\n\nDevelop transformative coaching methodologies and frameworks.\nDeliver extraordinary, measurable results for our clients.\n\nOur organizational culture is designed so all team members win.`,
//   },
//   {
//     id: 3,
//     title: 'Brand Promise',
//     content: '',
//   },
//   {
//     id: 4,
//     title: 'Profit Per X',
//     content: '',
//   },
//   {
//     id: 5,
//     title: 'BHAG',
//     content: '$100 Billion in Exit Value',
//   },
//   {
//     id: 6,
//     title: '3HAG',
//     content: '$7Mil in Revenue by 2027',
//   },
// ];


export const initialFoundations = [
  {
    id: 1,
    title: '-',
    content: '-',
  },
  {
    id: 2,
    title: '-',
    content: '-',
  },
  {
    id: 3,
    title: '-',
    content: '-',
  },
  {
    id: 4,
    title: '-',
    content: '-',
  },
  {
    id: 5,
    title: '-',
    content: '-',
  },
  {
    id: 6,
    title: '-',
    content: '-',
  },
];

const useFoundationsStore = create((set) => ({
  foundations: initialFoundations,
  setFoundations: (newFoundations) => set({ foundations: newFoundations }),
  loadFoundationsFromAPI: (data) => set({ foundations: data }), 
  updateFoundationField: (id, field, value) =>
    set((state) => ({
      foundations: state.foundations.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })),
  pushFoundation: (newItem) =>
    set((state) => ({
      foundations: [
        ...state.foundations,
        { id: state.foundations.length + 1, ...newItem },
      ],
    })),
}));


export default useFoundationsStore;
