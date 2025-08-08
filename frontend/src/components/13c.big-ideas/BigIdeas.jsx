// frontend\src\components\13c.big-ideas\BigIdeas.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import BigIdeasHeader from './0.BigIdeasHeader/BigIdeasHeader';
import BigIdeasTable from './1.BigIdeasTable/BigIdeasTable';
import useBigIdeasStore from '../../store/left-lower-content/13.tools/3.bigIdeasStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../configs/config';
import './BigIdeas.css';

const BigIdeas = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const organization = useLayoutSettingsStore((state) => state.organization);
  const setBigIdeasTable = useBigIdeasStore((state) => state.setBigIdeasTable);
  const navigate = useNavigate();

    // Fetch Big ideas Table Data
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);

    fetch(`${API_URL}/v1/tools/big-ideas?organization=${encodedOrg}`, {
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
          ENABLE_CONSOLE_LOGS && console.log('📥 Big Ideas fetched:', json);
          if (Array.isArray(json)) {
            setBigIdeasTable(json);
          } else {
            console.warn(`⚠️ Unexpected response for org: ${organization}`);
          }
        } else if (res.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('❌ Server Error:', json.message);
        }
      })
      .catch((err) => {
        console.error('❌ Fetch Error:', err);
      });
  }, [organization]);

  // useEffect(() => {
  //   fetch(`${API_URL}/mock-response2`, {
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
    //   <h2 className="text-xl font-bold mb-4">Tools</h2>
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
      <BigIdeasHeader />
      <BigIdeasTable />

      <span>&nbsp;</span>  
    </div>
  );
};

export default BigIdeas;
