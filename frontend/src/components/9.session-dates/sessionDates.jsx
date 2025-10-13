//frontend\src\components\session-dates\sessionDates.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import SessionDatesHeader from './0.SessionDatesHeader/SessionDatesHeader';
import MonthlySessionTracker from './1.MonthlySessionTracker/MonthlySessionTracker';
import QuarterlySessions from './2.QuarterlySessions/QuarterlySessions';
import MonthlySessions from './3.MonthlySessions/MonthlySessions';
import useMonthlySessionTrackerStore from '../../store/left-lower-content/9.session-dates/1.monthlySessionTrackerStore';
import useQuarterlySessionsStore from '../../store/left-lower-content/9.session-dates/2.quarterlySessionsStore';
import useMonthlySessionsStore from '../../store/left-lower-content/9.session-dates/3.monthlySessionsStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { ENABLE_CONSOLE_LOGS } from '../../configs/config';
import API_URL from '../../configs/config';
import './sessionDates.css';



const SessionDates = () => {
  // const { user, setUser } = useUserStore();
  // const [error, setError] = useState(null);

  const setAllSessions = useMonthlySessionTrackerStore((state) => state.setAllSessions);
  const setQuarterlySessions = useQuarterlySessionsStore((state) => state.setQuarterlySessions);
  const setMonthlySessions = useMonthlySessionsStore((state) => state.setMonthlySessions);
  const organization = useLayoutSettingsStore((state) => state.organization);

  const navigate = useNavigate();

  
  // // Fetch QuarterlySessions Data
  // useEffect(() => {
  //   const encodedOrg = encodeURIComponent(organization);

  //   fetch(`${API_URL}/v1/session-dates/monthly-sessions-tracker?organization=${encodedOrg}`, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //   })
  //     .then(async (res) => {
  //       const json = await res.json();
  //       if (res.ok) {
  //         ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Monthly Session Tracker data:', json);

  //         const sessions = json[organization];

  //         if (Array.isArray(sessions)) {
  //           setAllSessions(sessions);
  //         } else {
  //           console.error(`⚠️ No sessions found for organization: ${organization}`);
  //         }
  //       } else if (res.status === 401) {
  //         navigate('/', { state: { loginError: 'Session Expired' } });
  //       } else {
  //         console.error('Error:', json.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('API error:', err);
  //     });
  // }, [organization, setAllSessions, navigate]);

  // // Fetch QuarterlySessions Data
  // useEffect(() => {
  //   const encodedOrg = encodeURIComponent(organization);

  //   fetch(`${API_URL}/v1/session-dates/quarterly-sessions?organization=${encodedOrg}`, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //   })
  //     .then(async (res) => {
  //       const json = await res.json();
  //       if (res.ok) {
  //         ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Quarterly Sessions data:', json);

  //         const sessionArr = json[organization];

  //         if (Array.isArray(sessionArr)) {
  //           setQuarterlySessions(sessionArr);
  //         } else {
  //           console.error(`⚠️ No sessions found for organization: ${organization}`);
  //         }
  //       } else if (res.status === 401) {
  //         navigate('/', { state: { loginError: 'Session Expired' } });
  //       } else {
  //         console.error('Error:', json.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('API error:', err);
  //     });
  // }, [organization, setQuarterlySessions, navigate]);

  // // Fetch MonthlySessions Data
  // useEffect(() => {
  //   const encodedOrg = encodeURIComponent(organization);

  //   fetch(`${API_URL}/v1/session-dates/monthly-sessions?organization=${encodedOrg}`, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //   })
  //     .then(async (res) => {
  //       const json = await res.json();
  //       if (res.ok) {
  //         ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Monthly Sessions data:', json);

  //         const monthlySessionArr = json[organization];

  //         if (Array.isArray(monthlySessionArr)) {
  //           setMonthlySessions(monthlySessionArr);
  //         } else {
  //           console.error(`⚠️ No monthly sessions found for organization: ${organization}`);
  //         }
  //       } else if (res.status === 401) {
  //         navigate('/', { state: { loginError: 'Session Expired' } });
  //       } else {
  //         console.error('Error:', json.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('API error:', err);
  //     });
  // }, [organization, setMonthlySessions, navigate]);


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
    //   <h2 className="text-xl font-bold mb-4">Session Dates</h2>
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
      <SessionDatesHeader />
      <MonthlySessionTracker />
      <QuarterlySessions />
      <MonthlySessions />


      <span>&nbsp;</span>  
    </div>

  );
};

export default SessionDates;
