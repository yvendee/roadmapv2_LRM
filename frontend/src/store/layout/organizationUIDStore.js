// frontend\src\store\layout\organizationUIDStore.js
import { create } from 'zustand';

export const useOrganizationUIDStore = create((set) => ({
  uid: null,
  setUID: (value) => set({ uid: value }),
}));
