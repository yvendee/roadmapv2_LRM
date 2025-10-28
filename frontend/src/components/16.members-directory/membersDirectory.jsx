// frontend\src\components\16.members-directory\membersDirectory.jsx
import React, { useEffect, useState } from 'react';
import MembersDirectoryHeader from './0.MembersDirectoryHeader/MembersDirectoryHeader';
import InformationSection from './1.InformationSection/InformationSection';
import EmployeeTable from './2.EmployeeTable/EmployeeTable';
import useMembersDepartmentsStore from '../../store/left-lower-content/16.members-directory/1.membersDirectoryStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
// import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './membersDirectory.css';

const membersDirectory = () => {
  // const { user, setUser } = useUserStore();
  // const [error, setError] = useState(null);
  const organization = useLayoutSettingsStore((state) => state.organization);
  const setMembersDepartments = useMembersDepartmentsStore((state) => state.setMembersDepartments);
  const setBaselineMembersDirectoryTable = useMembersDepartmentsStore((state) => state.setBaselineMembersDirectoryTable)

  const navigate = useNavigate();

  // Fetch Members-Directory Table Data
  useEffect(() => {

    const localData = localStorage.getItem('NewMembersDirectoryTableData');
    if (!localData) {

      const encodedOrg = encodeURIComponent(organization);

      fetch(`${API_URL}/v1/members-directory?organization=${encodedOrg}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then(async (res) => {
          const json = await res.json();
          if (res.ok) {
            const employeeList = json;
            if (Array.isArray(employeeList)) {
              setMembersDepartments(employeeList);
              setBaselineMembersDirectoryTable(employeeList);
            } else {
              console.error(`⚠️ No Members Directory found for organization: ${organization}`);
            }
          } else if (res.status === 401) {
            navigate('/', { state: { loginError: 'Session Expired' } });
          } else {
            console.error('Error:', json.message);
          }
        })
        .catch((err) => {
          console.error('API error:', err);
        });
    }
  }, [organization]);
  


  return (
  

    <div className="main-content-view">
      <MembersDirectoryHeader />
      <InformationSection />
      <EmployeeTable />

      <span>&nbsp;</span>  
    </div>
  );
};

export default membersDirectory;
