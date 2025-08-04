// frontend\src\store\left-lower-content\12.coaching-alignment\3.whatsNextStore.js

import { create } from 'zustand';

export const initialWhatsNext = {
  whatsNextItems: ['Test', 'test'],
};

const useWhatsNextStore = create((set) => ({
  whatsNextItems: initialWhatsNext.whatsNextItems,

  setWhatsNextItems: (items) => set({ whatsNextItems: items }),

  setWhatsNext: (data) =>
    set({
      whatsNextItems: Array.isArray(data.whatsNextItems)
        ? data.whatsNextItems
        : initialWhatsNext.whatsNextItems,
    }),

  updateWhatsNextItem: (index, updatedItem) =>
    set((state) => {
      const updated = [...state.whatsNextItems];
      updated[index] = updatedItem;
      return { whatsNextItems: updated };
    }),

  resetWhatsNextItem: () =>
    set({
      whatsNextItems: initialWhatsNext.whatsNextItems,
    }),
}));

export default useWhatsNextStore;
