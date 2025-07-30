import { create } from 'zustand';

const initialWeeklySprintData = Array.from({ length: 13 }, (_, weekIndex) => ({
  week: weekIndex + 1,
  keyFocus: Array(5).fill(' '),
  topTasks: ['-', '-', '-'],
  progress: Array(5).fill('0%'),
  blockers: Array(5).fill(' '),
  coachNotes: ' ',
}));

const useWeeklySprintTrackerStore = create((set) => ({
  weeklySprints: initialWeeklySprintData,

  updateKeyFocus: (week, index, value) =>
    set((state) => ({
      weeklySprints: (state.weeklySprints ?? []).map((w) =>
        w.week === week
          ? {
              ...w,
              keyFocus: (w.keyFocus ?? []).map((item, i) => (i === index ? value : item)),
            }
          : w
      ),
    })),

  updateTopTask: (week, taskIndex, value) =>
    set((state) => ({
      weeklySprints: (state.weeklySprints ?? []).map((w) =>
        w.week === week
          ? {
              ...w,
              topTasks: (w.topTasks ?? []).map((task, i) => (i === taskIndex ? value : task)),
            }
          : w
      ),
    })),

  updateProgress: (week, index, value) =>
    set((state) => ({
      weeklySprints: (state.weeklySprints ?? []).map((w) =>
        w.week === week
          ? {
              ...w,
              progress: (w.progress ?? []).map((p, i) => (i === index ? value : p)),
            }
          : w
      ),
    })),

  updateBlockers: (week, index, value) =>
    set((state) => ({
      weeklySprints: (state.weeklySprints ?? []).map((w) =>
        w.week === week
          ? {
              ...w,
              blockers: (w.blockers ?? []).map((b, i) => (i === index ? value : b)),
            }
          : w
      ),
    })),

  updateCoachNotes: (week, value) =>
    set((state) => ({
      weeklySprints: (state.weeklySprints ?? []).map((w) =>
        w.week === week ? { ...w, coachNotes: value } : w
      ),
    })),

  addKeyFocusEntry: (week) =>
    set((state) => ({
      weeklySprints: (state.weeklySprints ?? []).map((w) =>
        w.week === week && (w.keyFocus?.length ?? 0) < 10
          ? {
              ...w,
              keyFocus: [...(w.keyFocus ?? []), ' '],
              progress: [...(w.progress ?? []), '0%'],
              blockers: [...(w.blockers ?? []), ' '],
            }
          : w
      ),
    })),

  setWeeklySprints: (data) => set({ weeklySprints: data }),
}));

export default useWeeklySprintTrackerStore;
