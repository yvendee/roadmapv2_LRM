// frontend\src\store\left-lower-content\14.document-vault\1.documentVaultStore.js
import { create } from 'zustand';

export const initialDocumentVault = [
  {
    id: 1,
    projectName: 'Momentum OS',
    date: '2025-03-28',
    link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
    viewLink: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
    uploadLink: '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
    pdflink: '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
  },
  {
    id: 2,
    projectName: 'Client Delivery System',
    date: '2025-03-29',
    link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
    viewLink: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
    uploadLink: '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
    pdflink: '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
  },
  {
    id: 3,
    projectName: 'Momentum Hub',
    date: '2025-03-30',
    link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
    viewLink: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
    uploadLink: '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
    pdflink: '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
  },
  {
    id: 4,
    projectName: 'Lead Gen System',
    date: '2025-03-31',
    link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
    viewLink: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
    uploadLink: '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
    pdflink: '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
  },
  {
    id: 5,
    projectName: '1% Genius v3',
    date: '2025-04-01',
    link: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
    viewLink: 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
    uploadLink: '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
    pdflink: '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
  },
];




const useDocumentVaultStore = create((set) => ({
  documentVaultTable: initialDocumentVault,

  setDocumentVault: (documentVaults) => set({ documentVaultTable: documentVaults }),

  addDocumentVault: (documentVault) =>
    set((state) => ({
      documentVaultTable: [...state.documentVaultTable, documentVault],
    })),

  updateDocumentVaultTableField: (id, field, value) =>
    set((state) => ({
      documentVaultTable: state.documentVaultTable.map((documentVault) =>
        documentVault.id === id ? { ...documentVault, [field]: value } : documentVault
      ),
    })),

  pushDocumentVaultTableField: (documentVault) =>
    set((state) => {
      const newDocumentVault = {
        id: state.documentVaultTable.length + 1,
        projectName: documentVault.projectName || '',
        date: documentVault.date || '',
        link: documentVault.link || '',
        viewLink: documentVault.viewLink || '',
        uploadLink: documentVault.uploadLink || '',
        pdflink: documentVault.pdflink || '',
      };
      return {
        documentVaultTable: [...state.documentVaultTable, newDocumentVault],
      };
    }),

  loadProductEvaluationGridTableFromAPI: (documentVaults) =>
    set({ documentVaultTable: documentVaults }),
}));

export default useDocumentVaultStore;
