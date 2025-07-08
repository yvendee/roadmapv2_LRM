// frontend/src/store/left-lower-content/0.layout-settings/layoutSettingsStore.js
import { create } from 'zustand';

export const useLayoutSettingsStore = create((set) => ({
  toggles: {
    'Strategic Drivers': true,
    'Foundations': true,
    '3 Year Outlook': true,
    'Playing to Win Strategy': true,
    'Core Capabilities': true,
    '4 Decisions': true,
    'Constraints Tracker': true,
  },
  setToggle: (key, value) =>
    set((state) => ({
      toggles: {
        ...state.toggles,
        [key]: value,
      },
    })),
  setToggles: (newToggles) =>
    set(() => ({
      toggles: newToggles,
    })),
  organization: 'Chuck Gulledge Advisors, LLC',
  unique_id: '9834723984',
  setOrganization: (org) => set(() => ({ organization: org })),
  setUniqueId: (id) => set(() => ({ unique_id: id })),
}));
