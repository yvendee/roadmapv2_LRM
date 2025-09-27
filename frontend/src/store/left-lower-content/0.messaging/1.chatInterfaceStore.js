// frontend\src\store\left-lower-content\0.messaging\1.chatInterfaceStore.js
import { create } from 'zustand';

// export const initialMessages = [
//   {
//     id: 1,
//     sender: 'Kayven Delatado',  // right side
//     receipt: 'Maricar Aquino',
//     content: 'test',
//     datetime: '05/05/2025 03:38 PM',
//   },
//   {
//     id: 2,
//     sender: 'Maricar Aquino', // left side
//     receipt: 'Kayven Delatado',
//     content: 'I understand your concern. Let me look into that for you.',
//     datetime: '05/05/2025 03:38 PM',
//   },
// ];


export const initialMessages = [
];

const useChatInterfaceStore = create((set) => ({
  messages: initialMessages,
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (message) =>
    set((state) => {
      const newMsg = { ...message, id: state.messages.length + 1 };
      console.log("📨 New message added to store:", newMsg);
      return {
        messages: [...state.messages, newMsg],
      };
    }),
  // addMessage: (newMessage) =>
  //   set((state) => ({
  //     messages: [...state.messages, newMessage],
  //   })),
  updateMessageField: (id, field, value) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, [field]: value } : msg
      ),
    })),
  pushMessage: (message) =>
    set((state) => {
      const newMsg = { ...message, id: state.messages.length + 1 };
      console.log("📨 Message pushed to store:", newMsg);
      return {
        messages: [...state.messages, newMsg],
      };
    }),
  loadMessagesFromAPI: (msgs) => set({ messages: msgs }),
}));

export default useChatInterfaceStore;
