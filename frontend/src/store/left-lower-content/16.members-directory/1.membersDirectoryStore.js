// frontend\src\store\left-lower-content\16.members-directory\1.membersDirectoryStore.js
import { create } from 'zustand';

// export const initialEmployeeList = [
//   {
//     id: 1,
//     fullname: 'Maricar Aquino',
//     company: 'Chuck Gulledge Advisors, LLC',
//     email: 'maricar@chuckgulledge.com',
//     department: 'Admin',
//     memberAccess: 'Leadership',
//     canLogin: 'Yes',
//   },
//   {
//     id: 2,
//     fullname: 'Chuck Gulledge',
//     company: 'Chuck Gulledge Advisors, LLC',
//     email: 'chuck.gulledge@gmail.com',
//     department: 'Admin',
//     memberAccess: 'Superadmin',
//     canLogin: 'Yes',
//   },
// ];


export const initialEmployeeList = [
  {
    id: 1,
    fullname: '-',
    company: '-',
    email: '-',
    department: '-',
    memberAccess: '-',
    canLogin: '-',
  },
  {
    id: 2,
    fullname: '-',
    company: '-',
    email: '-',
    department: '-',
    memberAccess: '-',
    canLogin: '-',
  },
];


const useMembersDepartmentsStore = create((set) => ({
  MembersDepartmentsTable: initialEmployeeList,

  // Store the initial state when app loads
  baselineMembersDirectoryTable: initialEmployeeList,

  setBaselineMembersDirectoryTable: (data) => set({ baselineMembersDirectoryTable: data }),


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
        fullname: MembersDirectory.fullname || '',
        company: MembersDirectory.company || '',
        email: MembersDirectory.email || '',
        department: MembersDirectory.department || '',
        memberAccess: MembersDirectory.memberAccess || '',
        canLogin: MembersDirectory.canLogin || '',
      };
      return {
        MembersDepartmentsTable: [...state.MembersDepartmentsTable, newDocumentVault],
      };
    }),

  loadProductEvaluationGridTableFromAPI: (MembersDirectories) =>
    set({ MembersDepartmentsTable: MembersDirectories }),
}));

export default useMembersDepartmentsStore;
