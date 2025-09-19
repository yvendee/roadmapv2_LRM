// src/store/notificationStore.js
import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  // notifications: [
  //   { message: "You have a new message from John.", notification_status: "unread" },
  //   { message: "Meeting scheduled for tomorrow at 10AM.", notification_status: "unread" },
  //   { message: "Project status updated: In Review.", notification_status: "unread" },
  //   { message: "Don't forget to submit your report. @Kayven", notification_status: "unread" },
  //   { message: "Mentioned by @maricar in the strategy channel.", notification_status: "unread" }
  // ],

  notifications: [],
  
  setNotifications: (newList) => set({ notifications: newList }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        notification_status: "read",
      })),
    })),
}));

export default useNotificationStore;
