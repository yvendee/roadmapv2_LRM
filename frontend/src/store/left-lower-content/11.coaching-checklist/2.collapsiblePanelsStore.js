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
      { id: '1a', text: 'Welcome call completed', completed: true },
      { id: '1b', text: 'Onboarding documents submitted', completed: false },
    ],
  },
  {
    id: 2,
    title: 'Personal & Leadership Readiness',
    icon: faUserTie,
    expanded: false,
    items: [
      { id: '2a', text: 'Personal goals aligned', completed: true },
      { id: '2b', text: 'Leadership team commitment', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Strategic Clarity',
    icon: faBullseye,
    expanded: false,
    items: [
      { id: '3a', text: 'Vision and mission reviewed', completed: true },
      { id: '3b', text: 'Key strategic drivers defined', completed: false },
    ],
  },
  {
    id: 4,
    title: 'Execution Discipline',
    icon: faCheckSquare,
    expanded: false,
    items: [
      { id: '4a', text: 'Quarterly goals set', completed: false },
      { id: '4b', text: 'Weekly check-ins scheduled', completed: true },
    ],
  },
  {
    id: 5,
    title: 'Cash & Financial Discipline',
    icon: faMoneyBillWave,
    expanded: false,
    items: [
      { id: '5a', text: 'Cash flow projection ready', completed: false },
      { id: '5b', text: 'Budget aligned to goals', completed: true },
    ],
  },
  {
    id: 6,
    title: 'MomentumOS Performance System',
    icon: faChartLine,
    expanded: false,
    items: [
      { id: '6a', text: 'MomentumOS dashboard set up', completed: true },
      { id: '6b', text: 'Team trained to use system', completed: false },
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
          : { ...panel, expanded: false }
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
}));


export default useAccordionChecklistStore;

