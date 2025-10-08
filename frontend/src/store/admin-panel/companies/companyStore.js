// frontend\src\store\admin-panel\companies\companyStore.js
import { create } from 'zustand';

const useCompanyStore = create((set) => ({
  companies: [
    { id: 1, name: 'ABC Corp' },
    { id: 2, name: 'XYZ Ltd' },
    { id: 3, name: 'Example Inc' },
  ],
  selectedCompany: null,

  // Set the entire companies list
  setCompanies: (newCompanies) => set({ companies: newCompanies }),

  // Select a company to edit
  setSelectedCompany: (company) => set({ selectedCompany: company }),

  // Update a company and exit edit mode
  updateCompany: (updatedCompany) =>
    set((state) => ({
      companies: state.companies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      ),
      selectedCompany: null,
    })),
}));

export default useCompanyStore;
