// frontend\src\store\left-lower-content\12.coaching-alignment\1.currentFocusStore.js

import { create } from 'zustand';

export const initialCurrentFocus = {
  focusItems: ['Test', 'test'],
};

const useCurrentFocusStore = create((set) => ({
  focusItems: initialCurrentFocus.focusItems,

  setFocusItems: (items) => set({ focusItems: items }),

  setCurrentFocus: (data) =>
    set({
      focusItems: Array.isArray(data.focusItems)
        ? data.focusItems
        : initialCurrentFocus.focusItems,
    }),

  updateFocusItem: (index, updatedItem) =>
    set((state) => {
      const updated = [...state.focusItems];
      updated[index] = updatedItem;
      return { focusItems: updated };
    }),

  resetCurrentFocus: () =>
    set({
      focusItems: initialCurrentFocus.focusItems,
    }),
}));

export default useCurrentFocusStore;
