// frontend\src\store\left-lower-content\6.company-traction\3.activityLogStore.js
import { create } from 'zustand';

// Initial mock data (same as your image)
export const initialActivityLogs = [
    {
      id: 1,
      author: 'Maricar Aquino',
      message: 'Progress updated from % to 0% for Company Traction with description: Close target',
      timestamp: '2025-10-21T10:59:00', // a few seconds ago
    },
    {
      id: 2,
      author: 'Nonyameko Hibbetts',
      message: 'Progress updated from 100% to 10% for Company Traction with description: 201 Evans Cnst',
      timestamp: '2025-10-20T14:00:00', // 21 hours ago
    },
    {
      id: 3,
      author: 'Chuck Gulledge',
      message: 'Progress updated from % to 30% for Company Traction with description: Find the next project',
      timestamp: '2025-10-20T08:00:00', // 1 day ago
    },
    {
      id: 4,
      author: 'Chuck Gulledge',
      message: 'Company traction updated with description: Develop 2026 plan with Chuck and Team',
      timestamp: '2025-10-18T10:00:00', // 3 days ago
    },
    {
      id: 5,
      author: 'Nonyameko Hibbetts',
      message: 'Company traction created with description: Assist w/ Sale Closing Building E & O 2',
      timestamp: '2025-10-14T09:00:00', // 1 week ago
    },
  
    {
      id: 6,
      author: 'Maricar Aquino',
      message: 'Progress updated from % to 0% for Company Traction with description: Close target',
      timestamp: '2025-10-21T10:58:30',
    },
    {
      id: 7,
      author: 'Nonyameko Hibbetts',
      message: 'Progress updated from 100% to 10% for Company Traction with description: 201 Evans Cnst',
      timestamp: '2025-10-20T14:00:00',
    },
    {
      id: 8,
      author: 'Chuck Gulledge',
      message: 'Progress updated from % to 30% for Company Traction with description: Find the next project',
      timestamp: '2025-10-20T08:00:00',
    },
    {
      id: 9,
      author: 'Chuck Gulledge',
      message: 'Company traction updated with description: Develop 2026 plan with Chuck and Team',
      timestamp: '2025-10-18T10:00:00',
    },
    {
      id: 10,
      author: 'Nonyameko Hibbetts',
      message: 'Company traction created with description: Assist w/ Sale Closing Building E & O 2',
      timestamp: '2025-10-14T09:00:00',
    },
  
    {
      id: 11,
      author: 'Maricar Aquino',
      message: 'Progress updated from % to 0% for Company Traction with description: Close target',
      timestamp: '2025-10-21T10:57:00',
    },
    {
      id: 12,
      author: 'Nonyameko Hibbetts',
      message: 'Progress updated from 100% to 10% for Company Traction with description: 201 Evans Cnst',
      timestamp: '2025-10-20T14:00:00',
    },
    {
      id: 13,
      author: 'Chuck Gulledge',
      message: 'Progress updated from % to 30% for Company Traction with description: Find the next project',
      timestamp: '2025-10-20T08:00:00',
    },
    {
      id: 14,
      author: 'Chuck Gulledge',
      message: 'Company traction updated with description: Develop 2026 plan with Chuck and Team',
      timestamp: '2025-10-18T10:00:00',
    },
    {
      id: 15,
      author: 'Nonyameko Hibbetts',
      message: 'Company traction created with description: Assist w/ Sale Closing Building E & O 2',
      timestamp: '2025-10-14T09:00:00',
    },
  ];
  

const useActivityLogStore = create((set) => ({
  activityLogs: initialActivityLogs,

  addActivityLog: (log) =>
    set((state) => ({
      activityLogs: [
        {
          id: log.id || Date.now(),
          author: log.author,
          message: log.message,
          timestamp: log.timestamp || new Date().toISOString(), // consistent ISO format
        },
        ...state.activityLogs,
      ],
    })),
  

  clearActivityLogs: () => set({ activityLogs: [] }),
}));

export default useActivityLogStore;
