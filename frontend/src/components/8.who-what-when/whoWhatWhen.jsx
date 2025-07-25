// frontend\src\components\8.who-what-when\whoWhatWhen.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import WhoWhatWhenHeader from './0.WhoWhatWhenHeader/WhoWhatWhenHeader';
import WhoWhatWhenTable from './1.WhoWhatWhenTable/WhoWhatWhenTable';
import useWhoWhatWhenStore from '../../store/left-lower-content/8.who-what-when/1.whoWhatWhenStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { ENABLE_CONSOLE_LOGS } from '../../configs/config';
import API_URL from '../../configs/config';
import './whoWhatWhen.css';

const WhoWhatWhen = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const organization = useLayoutSettingsStore((state) => state.organization);
  const loadWhoWhatWhenFromAPI = useWhoWhatWhenStore((state) => state.loadWhoWhatWhenFromAPI);

  // Fetch Who-What-When Table Data
  useEffect(() => {
    const localData = localStorage.getItem('whoWhatWhenData');
    if (!localData) {
    const encodedOrg = encodeURIComponent(organization);

      fetch(`${API_URL}/v1/who-what-when?organization=${encodedOrg}`, {
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
            const whoWhatWhenArr = json;
            ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Who-What-When data:', whoWhatWhenArr);
            if (Array.isArray(whoWhatWhenArr)) {
              loadWhoWhatWhenFromAPI(whoWhatWhenArr);
            } else {
              console.error(`⚠️ No Who-What-When data found for organization: ${organization}`);
            }
          } else if (res.status === 401) {
            navigate('/', { state: { loginError: 'Session Expired' } });
          } else {
            console.error('Error:', json.message);
            setError(json.message);
          }
        })
        .catch((err) => {
          console.error('API error:', err);
          setError(err.message);
        });
    }
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
    //   <h2 className="text-xl font-bold mb-4">Who What When</h2>
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
      <WhoWhatWhenHeader />
      <WhoWhatWhenTable />

      <span>&nbsp;</span>  
    </div>
  );
};

export default WhoWhatWhen;
