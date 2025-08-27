// frontend\src\store\left-lower-content\2.one-page-strategic-plan\4.playingToWinStore.js
import { create } from 'zustand';

// export const initialPlayingToWin = [
//     { id: 1, title: 'One Phase Strategy', value: 'Revenue of $4 Million' },
//     { id: 2, title: 'Two Phase Strategy', value: 'Revenue of $7 Million' },
//     { id: 3, title: 'Three Phase Strategy', value: 'Revenue of $9 Million' },
// ];

  
// export const initialPlayingToWin = [
//     { title: '-', value: '-' },
//     { title: '-', value: '-' },
//     { title: '-', value: '-' },
// ];

export const initialPlayingToWin = [
  { id: 1, title: '-', value: '-' },
  { id: 2, title: '-', value: '-' },
  { id: 3, title: '-', value: '-' },
];
  

const usePlayingToWinStore = create((set) => ({
  playingtowins: initialPlayingToWin,
  setPlayingToWin: (data) => set({ playingtowins: data }),
  updatePlayingToWin: (title, value) =>
    set((state) => ({
      playingtowins: state.playingtowins.map((o) =>
        o.title === title ? { ...o, value } : o
      ),
    })),
  pushPlayingToWin: (item) =>
    set((state) => ({
      playingtowins: [...state.playingtowins, item],
    })),
}));

export default usePlayingToWinStore;
