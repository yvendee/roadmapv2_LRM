// frontend\src\store\layout\companyTractionUserStore.js
import { create } from 'zustand';

export const useCompanyTractionUserStore = create((set) => ({
  users: [],
  selectedUser: null,
  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
