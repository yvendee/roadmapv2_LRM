// frontend\src\store\left-lower-content\12.coaching-alignment\0.handleEditStore.js
import { create } from 'zustand';

export const useHandleEditStore = create((set) => ({
  isEditing: false,
  setIsEditing: (state) => set({ isEditing: state }),
}));
