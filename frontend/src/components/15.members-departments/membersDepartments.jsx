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
  // const { user, setUser } = useUserStore();
  // const [error, setError] = useState(null);


  // Fetch Members-Departments Data
  useEffect(() => {
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
  }, [organization]);

  // useEffect(() => {
  //   fetch(`${API_URL}/mock-response5`, {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then(async (res) => {
  //     const json = await res.json();
  //     if (res.ok) {
  //       setUser(json.data);
  //     } else if (res.status === 401) {
  //       navigate('/', { state: {loginError: 'Session Expired'} });
  //     } else {
  //       setError(json.message || 'Failed to fetch user data');
  //     }
  //   })
  //   .catch((err) => {
  //     console.error('API error:', err);
  //     setError('Something went wrong.');
  //   });
  // }, [setUser, navigate]);

  return (
    // <div>
    //   <h2 className="text-xl font-bold mb-4">Member's Departments</h2>
    //   {error ? (
    //     <p className="text-red-500">{error}</p>
    //   ) : user ? (
    //     <table className="table-auto border-collapse border border-gray-400">
    //       <tbody>
    //         <tr><td className="border p-2">Name</td><td className="border p-2">{user.name}</td></tr>
    //         <tr><td className="border p-2">Email</td><td className="border p-2">{user.email}</td></tr>
    //       </tbody>
    //     </table>
    //   ) : (
    //     <p>Loading...</p>
    //   )}
    // </div>

    <div className="main-content-view">
      <MembersDepartmentsHeader />
      <MembersDepartmentsTable />

      <span>&nbsp;</span>  
    </div>
  );
};

export default membersDepartments;
