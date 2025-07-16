// frontend\src\store\left-lower-content\4.scoreboard\1.annualPrioritiesScoreboardStore.js
import { create } from 'zustand';

export const initialAnnualPriorities = {
  average: 50.47,
  members: [
    { name: 'Maricar Aquino', score: 100 },
    { name: 'Chuck Gulledge', score: 71 },
    { name: '', score: 100 },
  ],
};

const useAnnualPrioritiesStore = create((set) => ({
  average: initialAnnualPriorities.average,
  members: initialAnnualPriorities.members,

  setAverage: (value) => set({ average: value }),
  setMembers: (list) => set({ members: list }),
  updateMember: (index, updatedMember) =>
    set((state) => {
      const updated = [...state.members];
      updated[index] = { ...updated[index], ...updatedMember };
      return { members: updated };
    }),
  resetAnnualPriorities: () =>
    set({
      average: initialAnnualPriorities.average,
      members: initialAnnualPriorities.members,
    }),
}));

export default useAnnualPrioritiesStore;
