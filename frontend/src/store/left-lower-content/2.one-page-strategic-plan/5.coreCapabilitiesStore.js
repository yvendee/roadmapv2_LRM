// frontend\src\store\left-lower-content\2.one-page-strategic-plan\5.coreCapabilitiesStore.js
import { create } from 'zustand';


// export const initialCoreCapabilities = [
//   { description: 'Leadership Training', orig: '✓', q1: 'x', q2: '✓', q3: 'x', q4: '✓', id: 1 },
//   { description: 'Technology Stack', orig: 'x', q1: '✓', q2: 'x', q3: '✓', q4: 'x', id: 2 },
// ];
export const initialCoreCapabilities = [
  { header1: 'description', header2: 'orig', header3: 'q1', header4: 'q2', header5: 'q3', header6: 'q4' },
  { description: '-', orig: '-', q1: '-', q2: '-', q3: '-', q4: '-', id: 1 }
];

const useCoreCapabilitiesStore = create((set) => ({
  coreCapabilities: initialCoreCapabilities,
  setCoreCapabilities: (data) => set({ coreCapabilities: data }),
  pushCoreCapability: (item) =>
    set((state) => ({
      coreCapabilities: [...state.coreCapabilities, item],
    })),
  removeCoreCapability: (id) =>
    set((state) => ({
      coreCapabilities: state.coreCapabilities.filter(
        (item, index) => index === 0 || item.id !== id // preserve header row
      ),
    })),
}));

export default useCoreCapabilitiesStore;
