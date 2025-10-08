// frontend\src\store\admin-panel\companies\companyStore.js
import { create } from 'zustand';

const useCompanyStore = create((set) => ({
  companies: [
    { id: 1, name: 'ABC Corp', code: 'ABC123' },
    { id: 2, name: 'XYZ Ltd', code: 'XYZ456' },
    { id: 3, name: 'Example Inc', code: 'EX789' },
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
