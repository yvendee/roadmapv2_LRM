// frontend\src\store\left-lower-content\4.scoreboard\3.projectProgressCardStore.js
import { create } from 'zustand';

// 📦 Initial values
export const initialProjectProgress = {
  completed: 10,
  total: 36,
};

const useProjectProgressStore = create((set) => ({
  completed: initialProjectProgress.completed,
  total: initialProjectProgress.total,

  setCompleted: (value) => set({ completed: value }),
  setTotal: (value) => set({ total: value }),

  updateProgress: ({ completed, total }) =>
    set((state) => ({
      completed: completed ?? state.completed,
      total: total ?? state.total,
    })),

  resetProgress: () =>
    set({
      completed: initialProjectProgress.completed,
      total: initialProjectProgress.total,
    }),
}));

export default useProjectProgressStore;
