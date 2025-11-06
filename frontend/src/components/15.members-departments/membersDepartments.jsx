// frontend\src\components\15.members-departments\membersDepartments.jsx
import React, { useEffect, useState } from 'react';
import MembersDepartmentsHeader from './0.MembersDepartmentsHeader/MembersDepartmentsHeader';
import MembersDepartmentsTable from './1.MembersDepartmentsTable/MembersDepartmentsTable';
import useMembersDepartmentsStore from '../../store/left-lower-content/15.members-departments/1.membersDepartmentsStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
// import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './membersDepartments.css';

const membersDepartments = () => {
  const navigate = useNavigate();
  const organization = useLayoutSettingsStore((state) => state.organization);
  const setMembersDepartments = useMembersDepartmentsStore((state) => state.setMembersDepartments);
  const setBaselineMembersDepartmentsTable = useMembersDepartmentsStore((state) => state.setBaselineMembersDepartmentsTable)

  // Fetch Members-Departments Data
  useEffect(() => {
    const localData = localStorage.getItem('NewMembersDepartmentsTableData');
    if (!localData) {
      const encodedOrg = encodeURIComponent(organization);

      fetch(`${API_URL}/v1/members-departments?organization=${encodedOrg}`, {
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
            const departmentsArr = json;
            ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Members-Departments data:', departmentsArr);
            if (Array.isArray(departmentsArr)) {
              setMembersDepartments(departmentsArr);
              setBaselineMembersDepartmentsTable(departmentsArr);
            } else {
              console.error(`⚠️ No Members-Departments data found for organization: ${organization}`);
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
      <MembersDepartmentsHeader />
      <MembersDepartmentsTable />

      <span>&nbsp;</span>  
    </div>
  );
};

export default membersDepartments;
