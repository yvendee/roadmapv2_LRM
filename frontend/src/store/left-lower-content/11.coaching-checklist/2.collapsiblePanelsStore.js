// frontend\src\store\left-lower-content\11.coaching-checklist\2.collapsiblePanelsStore.js
import { create } from 'zustand';
import {
  faHandshake,
  faUserTie,
  faBullseye,
  faCheckSquare,
  faMoneyBillWave,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

export const initialAccordionChecklist = [
  {
    id: 1,
    title: 'Client Onboarding',
    icon: faHandshake,
    expanded: false,
    items: [
      {
        id: '1a',
        text: 'Welcome call completed',
        completed: true,
        date: '2025-03-28',
        link: '',
        uploadLink: '/file-upload/your-upload-path-1a',
        pdflink: '',
      },
      {
        id: '1b',
        text: 'Onboarding documents submitted',
        completed: false,
        date: '',
        link: '',
        uploadLink: '/file-upload/your-upload-path-1b',
        pdflink: '',
      },
    ],
  },
  {
    id: 2,
    title: 'Personal & Leadership Readiness',
    icon: faUserTie,
    expanded: false,
    items: [
      {
        id: '2a',
        text: 'Personal goals aligned',
        completed: true,
        date: '2025-03-29',
        link: '',
        uploadLink: '/file-upload/your-upload-path-2a',
        pdflink: '',
      },
      {
        id: '2b',
        text: 'Leadership team commitment',
        completed: false,
        date: '',
        link: '',
        uploadLink: '/file-upload/your-upload-path-2b',
        pdflink: '',
      },
    ],
  },
  {
    id: 3,
    title: 'Strategic Clarity',
    icon: faBullseye,
    expanded: false,
    items: [
      {
        id: '3a',
        text: 'Vision and mission reviewed',
        completed: true,
        date: '2025-03-30',
        link: '',
        uploadLink: '/file-upload/your-upload-path-3a',
        pdflink: '',
      },
      {
        id: '3b',
        text: 'Key strategic drivers defined',
        completed: false,
        date: '',
        link: '',
        uploadLink: '/file-upload/your-upload-path-3b',
        pdflink: '',
      },
    ],
  },
  {
    id: 4,
    title: 'Execution Discipline',
    icon: faCheckSquare,
    expanded: false,
    items: [
      {
        id: '4a',
        text: 'Quarterly goals set',
        completed: false,
        date: '',
        link: '',
        uploadLink: '/file-upload/your-upload-path-4a',
        pdflink: '',
      },
      {
        id: '4b',
        text: 'Weekly check-ins scheduled',
        completed: true,
        date: '2025-03-31',
        link: '',
        uploadLink: '/file-upload/your-upload-path-4b',
        pdflink: '',
      },
    ],
  },
  {
    id: 5,
    title: 'Cash & Financial Discipline',
    icon: faMoneyBillWave,
    expanded: false,
    items: [
      {
        id: '5a',
        text: 'Cash flow projection ready',
        completed: false,
        date: '',
        link: '',
        uploadLink: '/file-upload/your-upload-path-5a',
        pdflink: '',
      },
      {
        id: '5b',
        text: 'Budget aligned to goals',
        completed: true,
        date: '2025-04-01',
        link: '',
        uploadLink: '/file-upload/your-upload-path-5b',
        pdflink: '',
      },
    ],
  },
  {
    id: 6,
    title: 'MomentumOS Performance System',
    icon: faChartLine,
    expanded: false,
    items: [
      {
        id: '6a',
        text: 'MomentumOS dashboard set up',
        completed: true,
        date: '2025-04-02',
        link: '',
        uploadLink: '/file-upload/your-upload-path-6a',
        pdflink: '',
      },
      {
        id: '6b',
        text: 'Team trained to use system',
        completed: false,
        date: '',
        link: '',
        uploadLink: '/file-upload/your-upload-path-6b',
        pdflink: '',
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
          : panel // ✅ don't collapse others
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
                  item.id === itemId
                    ? { ...item, [field]: value }
                    : item
                ),
              }
            : panel
        ),
      })),
    
}));


export default useAccordionChecklistStore;

