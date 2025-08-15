// frontend\src\store\left-lower-content\0.messaging\2.contactListStore.js
import { create } from 'zustand';

// export const initialContacts = [
//   { id: 1, name: 'Kayven Delatado' },
//   { id: 2, name: 'Maricar Aquino' },
//   { id: 3, name: 'John Santos' },
//   { id: 4, name: 'Angela Reyes' },
//   { id: 5, name: 'Mark Villanueva' },
// ];

export const initialContacts = [
];

const useContactListStore = create((set) => ({
  contacts: initialContacts,
  setContacts: (contacts) => set({ contacts }),
  addContact: (contact) =>
    set((state) => ({
      contacts: [...state.contacts, { ...contact, id: state.contacts.length + 1 }],
    })),
}));

export default useContactListStore;
