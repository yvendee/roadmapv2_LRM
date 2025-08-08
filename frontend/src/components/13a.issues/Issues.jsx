// frontend\src\components\13a.issues\Issues.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import IssuesHeader from './0.IssuesHeader/IssuesHeader';
import IssueTable from './1.IssueTable/IssueTable';
import useIssuesStore from '../../store/left-lower-content/13.tools/1.issuesStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../configs/config';
import { useNavigate } from 'react-router-dom';
import './Issues.css';

const Issues = () => {
  const organization = useLayoutSettingsStore((state) => state.organization);
  const setIssuesTable = useIssuesStore((state) => state.setIssuesTable);
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Issues Table Data
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);

    fetch(`${API_URL}/v1/tools/issues?organization=${encodedOrg}`, {
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
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Issues data:', json);
          setIssuesTable(json);
        } else if (res.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('Issues Fetch Error:', json.message);
        }
      })
      .catch((err) => {
        console.error('Issues API error:', err);
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
      <IssuesHeader />
      <IssueTable />

      <span>&nbsp;</span>  
    </div>
  );
};

export default Issues;
