// frontend\src\store\left-lower-content\0.messaging\3.leftConversationsStore.js
import { create } from 'zustand';

export const initialinitialSavedContact = [
  { id: 1, sender: 'Kayven Delatado', uid: '-' },
  { id: 2, sender: 'Jamie Lee', uid: '-' },
];

// export const initialinitialSavedContact = [
// ];

const useLeftConversationsStore = create((set) => ({
  savedContacts: initialinitialSavedContact,
  setSavedContacts: (contacts) => set({ savedContacts: contacts }),
  addSavedContact: (contact) =>
    set((state) => {
      const exists = state.savedContacts.some((c) => c.sender === contact.sender);
      if (exists) {
        console.log('ℹ️ Contact already in Left Conversations:', contact);
        return { savedContacts: state.savedContacts };
      }
      const newEntry = {
        id: state.savedContacts.length + 1,
        sender: contact.sender,
        uid: contact.uid ?? '-',
      };
      console.log('➕ Added to Left Conversations:', newEntry);
      return { savedContacts: [...state.savedContacts, newEntry] };
    }),
}));

export default useLeftConversationsStore;
