// frontend\src\store\userStore.js
import { create } from 'zustand';

const useLoginStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
}));

export default useLoginStore;
