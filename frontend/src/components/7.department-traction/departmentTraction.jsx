//frontend\src\components\department-traction\departmentTraction.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import DepartmentTractionHeader from './0.DepartmentTractionHeader/DepartmentTractionHeader';
import DepartmentAnnualPriorities from './1.DepartmentAnnualPriorities/DepartmentAnnualPriorities';
import DepartmentTractionTable from './2.DepartmentTraction/DepartmentTraction';
import useDepartmentAnnualPrioritiesStore from '../../store/left-lower-content/7.department-traction/1.departmentAnnualPrioritiesStores';
import useDepartmentTractionStore from '../../store/left-lower-content/7.department-traction/2.departmentTractionStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './departmentTraction.css';

const DepartmentTraction = () => {

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const organization = useLayoutSettingsStore((state) => state.organization);
  const loadDepartmentAnnualPrioritiesFromAPI = useDepartmentAnnualPrioritiesStore((state) => state.loadDepartmentAnnualPrioritiesFromAPI);
  const setDepartmentTraction = useDepartmentTractionStore((state) => state.setDepartmentTraction);
  const setBaselineDepartmentTraction = useDepartmentTractionStore((state) => state.setBaselineDepartmentTraction);
  // Fetch Department-Annual-Priorities
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);

    fetch(`${API_URL}/v1/department-traction/annual-priorities?organization=${encodedOrg}`, {
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
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Department Annual Priorities:', json);
          if (Array.isArray(json)) {
            loadDepartmentAnnualPrioritiesFromAPI(json);
          } else {
            console.warn(`⚠️ No data found for organization: ${organization}`);
          }
        } else if (res.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('Fetch error:', json.message);
        }
      })
      .catch((err) => {
        console.error('API Error:', err);
      });
  }, [organization]);


  // Fetch Department-Traction-Table
  useEffect(() => {

    const localData = localStorage.getItem('departmentTractionData');
    if (!localData) {

      const encodedOrg = encodeURIComponent(organization);

      fetch(`${API_URL}/v1/department-traction/traction-data?organization=${encodedOrg}`, {
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
            ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Department Traction Table:', json);
            setDepartmentTraction(json);
            setBaselineDepartmentTraction(json);

          } else if (res.status === 401) {
            navigate('/', { state: { loginError: 'Session Expired' } });
          } else {
            console.error('Fetch error:', json.message);
          }
        })
        .catch((err) => {
          console.error('API error:', err);
        });

    }

  }, [organization]);
  
  // const { user, setUser } = useUserStore();
  // const [error, setError] = useState(null);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   fetch(`${API_URL}/mock-response4`, {
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
    //   <h2 className="text-xl font-bold mb-4">Department Traction</h2>
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
      <DepartmentTractionHeader />
      <DepartmentAnnualPriorities />
      <DepartmentTractionTable />

      <span>&nbsp;</span>  
    </div>

  );
};

export default DepartmentTraction;
