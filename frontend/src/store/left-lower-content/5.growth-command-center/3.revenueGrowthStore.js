// frontend\src\store\left-lower-content\5.growth-command-center\3.revenueGrowthStore.js
import { create } from 'zustand';

const useRevenueGrowthStore = create((set) => ({
  revenueGrowthData: [],
  setRevenueGrowthData: (data) => set({ revenueGrowthData: data }),
}));

export default useRevenueGrowthStore;
