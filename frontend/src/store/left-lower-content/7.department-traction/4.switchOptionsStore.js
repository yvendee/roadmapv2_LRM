// frontend\src\store\left-lower-content\7.department-traction\4.switchOptionsStore.js
import { create } from 'zustand';

// Initial options
const initialSwitchOptions = [];

const useSwitchOptionsStore = create((set) => ({
  switchOptions: initialSwitchOptions,

  setSwitchOptions: (newOptions) => set({ switchOptions: newOptions }),

  addSwitchOption: (option) =>
    set((state) => ({
      switchOptions: [...state.switchOptions, option],
    })),

  removeSwitchOption: (option) =>
    set((state) => ({
      switchOptions: state.switchOptions.filter((opt) => opt !== option),
    })),

  clearSwitchOptions: () => set({ switchOptions: [] }),
}));

export default useSwitchOptionsStore;
