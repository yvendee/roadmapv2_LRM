// frontend\src\store\left-lower-content\2.one-page-strategic-plan\5.coreCapabilitiesStore.js
import { create } from 'zustand';


export const initialCoreCapabilities = [
  { description: 'Leadership Training', orig: '✓', q1: 'x', q2: '✓', q3: 'x', q4: '✓', id: 1 },
  { description: 'Technology Stack', orig: 'x', q1: '✓', q2: 'x', q3: '✓', q4: 'x', id: 2 },
];

// export const initialCoreCapabilities = [
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 1 },
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 2 },
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 3 },
//   { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 4 },
// ];

const useCoreCapabilitiesStore = create((set) => ({
  coreCapabilities: initialCoreCapabilities,
  setCoreCapabilities: (data) => set({ coreCapabilities: data }),
  pushCoreCapability: (item) =>
    set((state) => ({
      coreCapabilities: [...state.coreCapabilities, item],
    })),
}));

export default useCoreCapabilitiesStore;
