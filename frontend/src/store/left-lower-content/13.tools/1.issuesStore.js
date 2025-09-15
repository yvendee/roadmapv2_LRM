// frontend\src\store\left-lower-content\13.tools\1.issuesStore.js
import { create } from 'zustand';

// export const initialIssues = [
//   {
//     id: 1,
//     issueName: 'System Issue 1',
//     description: 'Systematize Coaching Framework (now called Momentum OS).',
//     status: '100.00%',
//     dateLogged: '2025-03-31',
//     who: 'Kayven',
//     resolution: 'resolution here',
//     dateResolved: '2025-04-02',
//   },
//   {
//     id: 2,
//     issueName: 'System Issue 2',
//     description: 'Systematize Client Delivery.',
//     status: '83.33%',
//     dateLogged: '2025-03-29',
//     who: 'Kayven',
//     resolution: 'resolution here 1',
//     dateResolved: '2025-04-03',
//   },
//   {
//     id: 3,
//     issueName: 'System Issue 2',
//     description:
//       'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
//     status: '0.00%',
//     dateLogged: '2025-03-28',
//     who: 'Kayven',
//     resolution: 'resolution here 2',
//     dateResolved: '2025-04-03',
//   },
//   {
//     id: 4,
//     issueName: 'System Issue 3',
//     description: 'Develop lead generation systems.',
//     status: '50.00%',
//     dateLogged: '2025-03-27',
//     who: 'Kayven',
//     resolution: 'resolution here 3',
//     dateResolved: '2025-04-04',
//   },
//   {
//     id: 5,
//     issueName: 'System Issue 4',
//     description: '1% Genius Version 3 Development.',
//     status: '50.00%',
//     dateLogged: '2025-03-26',
//     who: 'Kayven',
//     resolution: 'resolution here 4',
//     dateResolved: '2025-04-05',
//   },
// ];


export const initialIssues = [
  {
    id: 1,
    issueName: '-',
    description: '-',
    status: '-',
    dateLogged: '-',
    who: '-',
    resolution: '-',
    dateResolved: '-',
  },
  {
    id: 2,
    issueName: '-',
    description: '-',
    status: '-',
    dateLogged: '-',
    who: '-',
    resolution: '-',
    dateResolved: '-',
  },
  {
    id: 3,
    issueName: '-',
    description: '-',
    status: '-',
    dateLogged: '-',
    who: '-',
    resolution: '-',
    dateResolved: '-',
  },
  {
    id: 4,
    issueName: '-',
    description: '-',
    status: '-',
    dateLogged: '-',
    who: '-',
    resolution: '-',
    dateResolved: '-',
  },
  {
    id: 5,
    issueName: '-',
    description: '-',
    status: '-',
    dateLogged: '-',
    who: '-',
    resolution: '-',
    dateResolved: '-',
  },
];


const useIssuesStore = create((set) => ({
  issuesTable: initialIssues,

  // Store the initial state when app loads
  baselineIssuesTable: initialIssues,

  setBaselineIssuesTable: (data) => set({ baselineIssuesTable: data }),

  setIssuesTable: (issues) => set({ issuesTable: issues }),

  addIssuesTable: (issue) =>
    set((state) => ({
      issuesTable: [...state.issuesTable, issue],
    })),

  updateIssuesTableField: (id, field, value) =>
    set((state) => ({
      issuesTable: state.issuesTable.map((issue) =>
        issue.id === id ? { ...issue, [field]: value } : issue
      ),
    })),

  pushIssuesTable: (issue) =>
    set((state) => {
      const newIssue = {
        id: state.issuesTable.length + 1,
        issueName: issue.issueName,
        description: issue.description,
        kpi: issue.kpi,
        status: issue.status,
        dateLogged: issue.dateLogged || '',     // date string (yyyy-mm-dd)
        who: issue.who,
        resolution: issue.resolution,
        dateResolved: issue.dateResolved || '', // date string (yyyy-mm-dd)
      };
      return {
        issuesTable: [...state.issuesTable, newIssue],
      };
    }),

  loadIssuesTableFromAPI: (issues) =>
    set({ issuesTable: issues }),
}));

export default useIssuesStore;
