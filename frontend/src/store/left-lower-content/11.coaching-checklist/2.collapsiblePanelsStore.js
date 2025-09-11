// frontend\src\store\left-lower-content\11.coaching-checklist\2.collapsiblePanelsStore.js
import { create } from 'zustand';
import {
  faHandshake,
  faUserTie,
  faBullseye,
  faCheckSquare,
  faMoneyBillWave,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

// export const initialAccordionChecklist = [
//   {
//     id: 1,
//     title: 'Client Onboarding',
//     icon: faHandshake,
//     expanded: false,
//     items: [
//       {
//         id: '1a',
//         text: 'Welcome call completed',
//         completed: true,
//         date: '2025-03-28',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//       {
//         id: '1b',
//         text: 'Onboarding documents submitted',
//         completed: false,
//         date: '',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: 'Personal & Leadership Readiness',
//     icon: faUserTie,
//     expanded: false,
//     items: [
//       {
//         id: '2a',
//         text: 'Personal goals aligned',
//         completed: true,
//         date: '2025-03-29',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//       {
//         id: '2b',
//         text: 'Leadership team commitment',
//         completed: false,
//         date: '',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//     ],
//   },
//   {
//     id: 3,
//     title: 'Strategic Clarity',
//     icon: faBullseye,
//     expanded: false,
//     items: [
//       {
//         id: '3a',
//         text: 'Vision and mission reviewed',
//         completed: true,
//         date: '2025-03-30',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//       {
//         id: '3b',
//         text: 'Key strategic drivers defined',
//         completed: false,
//         date: '',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//     ],
//   },
//   {
//     id: 4,
//     title: 'Execution Discipline',
//     icon: faCheckSquare,
//     expanded: false,
//     items: [
//       {
//         id: '4a',
//         text: 'Quarterly goals set',
//         completed: false,
//         date: '',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//       {
//         id: '4b',
//         text: 'Weekly check-ins scheduled',
//         completed: true,
//         date: '2025-03-31',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//     ],
//   },
//   {
//     id: 5,
//     title: 'Cash & Financial Discipline',
//     icon: faMoneyBillWave,
//     expanded: false,
//     items: [
//       {
//         id: '5a',
//         text: 'Cash flow projection ready',
//         completed: false,
//         date: '',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//       {
//         id: '5b',
//         text: 'Budget aligned to goals',
//         completed: true,
//         date: '2025-04-01',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//     ],
//   },
//   {
//     id: 6,
//     title: 'MomentumOS Performance System',
//     icon: faChartLine,
//     expanded: false,
//     items: [
//       {
//         id: '6a',
//         text: 'MomentumOS dashboard set up',
//         completed: true,
//         date: '2025-04-02',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//       {
//         id: '6b',
//         text: 'Team trained to use system',
//         completed: false,
//         date: '',
//         link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//         uploadLink: '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9',
//         pdflink: '',
//       },
//     ],
//   },
// ];


export const initialAccordionChecklist = [
  {
    id: 1,
    title: '-',
    icon: faHandshake,
    expanded: '-',
    items: [
      {
        id: '1a',
        text: '-',
        completed: true,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
      {
        id: '1b',
        text: '-',
        completed: false,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
    ],
  },
  {
    id: 2,
    title: '-',
    icon: faUserTie,
    expanded: '-',
    items: [
      {
        id: '2a',
        text: '-',
        completed: true,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
      {
        id: '2b',
        text: '-',
        completed: false,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
    ],
  },
  {
    id: 3,
    title: '-',
    icon: faBullseye,
    expanded: '-',
    items: [
      {
        id: '3a',
        text: '-',
        completed: true,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
      {
        id: '3b',
        text: '-',
        completed: false,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
    ],
  },
  {
    id: 4,
    title: '-',
    icon: faCheckSquare,
    expanded: '-',
    items: [
      {
        id: '4a',
        text: '-',
        completed: false,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
      {
        id: '4b',
        text: '-',
        completed: true,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
    ],
  },
  {
    id: 5,
    title: '-',
    icon: faMoneyBillWave,
    expanded: '-',
    items: [
      {
        id: '5a',
        text: '-',
        completed: false,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
      {
        id: '5b',
        text: '-',
        completed: true,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
    ],
  },
  {
    id: 6,
    title: '-',
    icon: faChartLine,
    expanded: '-',
    items: [
      {
        id: '6a',
        text: '-',
        completed: true,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
      {
        id: '6b',
        text: '-',
        completed: false,
        date: '',
        link: '-',
        uploadLink: '-',
        pdflink: '-',
      },
    ],
  },
];




const useAccordionChecklistStore = create((set) => ({
  panels: initialAccordionChecklist,

  setPanels: (panels) => set({ panels }),

  togglePanel: (id) =>
    set((state) => ({
      panels: state.panels.map((panel) =>
        panel.id === id
          ? { ...panel, expanded: !panel.expanded }
          : panel
      ),
    })),

  updateItemStatus: (panelId, itemId, completed) =>
    set((state) => ({
      panels: state.panels.map((panel) =>
        panel.id === panelId
          ? {
              ...panel,
              items: panel.items.map((item) =>
                item.id === itemId ? { ...item, completed } : item
              ),
            }
          : panel
      ),
    })),

  updateItemField: (panelId, itemId, field, value) =>
    set((state) => ({
      panels: state.panels.map((panel) =>
        panel.id === panelId
          ? {
              ...panel,
              items: panel.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : panel
      ),
    })),
    
}));

export default useAccordionChecklistStore;