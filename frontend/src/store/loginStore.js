// src/store/loginStore.js
import { create } from 'zustand';

const useLoginStore = create((set) => ({
  user: null,
  session_id: null, // ✅ Add this
  setUser: (userData) => set({ user: userData }),
  setSessionId: (id) => set({ session_id: id }), // ✅ Add setter
}));

export default useLoginStore;
