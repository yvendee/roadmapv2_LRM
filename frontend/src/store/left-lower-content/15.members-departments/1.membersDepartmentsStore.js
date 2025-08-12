// frontend\src\store\left-lower-content\15.members-departments\1.membersDepartmentsStore.js
import { create } from 'zustand';

export const initialMembersDepartments = [
  {
    id: 1,
    name: 'Momentum OS',
  },
  {
    id: 2,
    name: 'Client Delivery System',
  },
  {
    id: 3,
    name: 'Momentum Hub',
  },
  {
    id: 4,
    name: 'Lead Gen System',
  },
  {
    id: 5,
    name: '1% Genius v3',
  },
];


const useMembersDepartmentsStore = create((set) => ({
  MembersDepartmentsTable: initialMembersDepartments,

  setMembersDepartments: (MembersDirectories) => set({ MembersDepartmentsTable: MembersDirectories }),

  addMembersDepartments: (MembersDirectory) =>
    set((state) => ({
      MembersDepartmentsTable: [...state.MembersDepartmentsTable, MembersDirectory],
    })),

  updateMembersDepartmentsTableField: (id, field, value) =>
    set((state) => ({
      MembersDepartmentsTable: state.MembersDepartmentsTable.map((MembersDirectory) =>
        MembersDirectory.id === id ? { ...MembersDirectory, [field]: value } : MembersDirectory
      ),
    })),

  pushMembersDepartmentsTableField: (MembersDirectory) =>
    set((state) => {
      const newDocumentVault = {
        id: state.MembersDepartmentsTable.length + 1,
        name: MembersDirectory.name || '',
      };
      return {
        MembersDepartmentsTable: [...state.MembersDepartmentsTable, newDocumentVault],
      };
    }),

  loadProductEvaluationGridTableFromAPI: (MembersDirectories) =>
    set({ MembersDepartmentsTable: MembersDirectories }),
}));

export default useMembersDepartmentsStore;
