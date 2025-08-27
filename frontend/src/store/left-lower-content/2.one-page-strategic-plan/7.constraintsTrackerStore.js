// frontend\src\store\left-lower-content\2.one-page-strategic-plan\7.constraintsTrackerStore.js
import { create } from 'zustand';


{/* { constraintTitle: '', description: '', owner: '', actions: '', status: ''} */}


// export const initialConstraintsTracker = [
//   { constraintTitle: 'Leadership Training', description: 'Pending', owner: 'John Doe', actions: 'In Progress', status: 'Not Started', id: 1 },
//   { constraintTitle: 'Technology Stack', description: 'Completed', owner: 'Alice Smith', actions: 'Ongoing', status: 'Active', id: 2 },
//   { constraintTitle: 'Budget Allocation', description: 'Reviewed', owner: 'Sarah Lee', actions: 'Scheduled', status: 'Not Started', id: 3 },
//   { constraintTitle: 'Customer Feedback', description: 'Pending', owner: 'Mark Johnson', actions: 'Completed', status: 'Active', id: 4 },
//   { constraintTitle: 'Product Launch', description: 'Approved', owner: 'Linda Green', actions: 'In Progress', status: 'Active', id: 5 },
//   { constraintTitle: 'Team Collaboration', description: 'In Progress', owner: 'Emma Brown', actions: 'Scheduled', status: 'Not Started', id: 6 },
//   { constraintTitle: 'Market Research', description: 'Completed', owner: 'David White', actions: 'Pending', status: 'Inactive', id: 7 }
// ];

export const initialConstraintsTracker = [
  { constraintTitle: '-', description: '-', owner: '-', actions: '-', status: '-', id: 1 },
  { constraintTitle: '-', description: '-', owner: '-', actions: '-', status: '-', id: 2 },
  { constraintTitle: '-', description: '-', owner: '-', actions: '-', status: '-', id: 3 },
  { constraintTitle: '-', description: '-', owner: '-', actions: '-', status: '-', id: 4 },
  { constraintTitle: '-', description: '-', owner: '-', actions: '-', status: '-', id: 5 },
  { constraintTitle: '-', description: '-', owner: '-', actions: '-', status: '-', id: 6 },
  { constraintTitle: '-', description: '-', owner: '-', actions: '-', status: '-', id: 7 }
];


const useConstraintsTracker = create((set) => ({
    constraintsTracker: initialConstraintsTracker,
    setConstraintsTracker: (data) => set({ constraintsTracker: data }),
    pushConstraintsTracker: (item) =>
    set((state) => ({
      constraintsTracker: [...state.constraintsTracker, item],
    })),
}));

export default useConstraintsTracker;
