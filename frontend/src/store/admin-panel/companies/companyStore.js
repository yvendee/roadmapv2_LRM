// frontend\src\store\admin-panel\companies\companyStore.js
import { create } from 'zustand';

const useCompanyStore = create((set) => ({
  companies: [
    { id: 1, name: 'ABC Corp' },
    { id: 2, name: 'XYZ Ltd', },
    { id: 3, name: 'Example Inc', },
  ],
  selectedCompany: null,
  setSelectedCompany: (company) => set({ selectedCompany: company }),
  updateCompany: (updatedCompany) =>
    set((state) => ({
      companies: state.companies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      ),
      selectedCompany: null,
    })),
}));

export default useCompanyStore;
