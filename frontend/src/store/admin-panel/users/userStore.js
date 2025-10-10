// frontend/src/store/admin-panel/users/userStore.js
import { create } from 'zustand';

const useUserStore = create((set) => ({
  users: [
    { id: 1, company: '', name: '', email: '', emailVerifiedAt: '' },
    { id: 2, company: '', name: '', email: '', emailVerifiedAt: '' },
    { id: 3, company: '', name: '', email: '', emailVerifiedAt: '' },
  ],
  selectedUser: null,

  // Set the entire users list
  setUsers: (newUsers) => set({ users: newUsers }),

  // Select a user to edit
  setSelectedUser: (user) => set({ selectedUser: user }),

  // Update a user and exit edit mode
  updateUser: (updatedUser) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      ),
      selectedUser: null,
    })),
}));

export default useUserStore;
