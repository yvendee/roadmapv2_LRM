// frontend\src\components\one-page-strategic-plan\onePageStrategicPlan.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import HeaderWithPrint from './0.HeaderWithPrint/HeaderWithPrint';
import StrategicDriversTable from './1.StrategicDriversTable/StrategicDriversTable';
import FoundationsSection from './2.FoundationsSection/FoundationsSection';
import ThreeYearOutlook from './3.ThreeYearOutlook/ThreeYearOutlook';
import PlayingToWin from './4.PlayingToWin/PlayingToWin';
import CoreCapabilities from './5.CoreCapabilities/CoreCapabilities';
import FourDecisions from './6.FourDecisions/FourDecisions';
import ConstraintsTracker from './7.ConstraintsTracker/ConstraintsTracker';
import useStrategicDriversStore from '../../store/left-lower-content/2.one-page-strategic-plan/1.strategicDriversStore';
import useFoundationsStore from '../../store/left-lower-content/3.foundations/foundationsStore';

import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { useNavigate } from 'react-router-dom'; 
import './onePageStrategicPlan.css';


const OnePageStrategicPlan = () => {
  const { user, setUser } = useUserStore();
  const loadStrategicDriversFromAPI = useStrategicDriversStore((state) => state.loadStrategicDriversFromAPI);
  const loadFoundationsFromAPI = useFoundationsStore((state) => state.loadFoundationsFromAPI);

  const navigate = useNavigate(); // Ensure it's inside your component
  const toggles = useLayoutSettingsStore((state) => state.toggles);

  // useEffect(() => {
  //   fetch(`${API_URL}/mock-response2`)
  //     .then((res) => res.json())
  //     .then((json) => setUser(json.data));
  // }, [setUser]);

  // //StrategicDrivers
  // useEffect(() => {

  //   fetch(`${API_URL}/v1/one-page-strategic-plan/strategic-drivers`, {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include', // important for Laravel session cookies
  //   })
  //     .then(async (res) => {
  //       const json = await res.json();
  //       if (res.ok) {
  //         ENABLE_CONSOLE_LOGS &&  console.log('Fetched Strategic Drivers data:', json);
  //         loadStrategicDriversFromAPI(json); // Assuming this function is imported from store
  //       } else if (res.status === 401) {
  //         navigate('/', { state: { loginError: 'Session Expired' } });
  //       } else {
  //         console.error('Error:', json.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('API error:', err);
  //     });
  // }, [loadStrategicDriversFromAPI]);
  // //Foundations
  // useEffect(() => {
  //   fetch(`${API_URL}/v1/one-page-strategic-plan/foundations`, {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //   })
  //     .then(async (res) => {
  //       const json = await res.json();
  //       if (res.ok) {
  //         ENABLE_CONSOLE_LOGS && console.log('Fetched Foundations data:', json);
  //         loadFoundationsFromAPI(json);
  //       } else if (res.status === 401) {
  //         navigate('/', { state: { loginError: 'Session Expired' } });
  //       } else {
  //         console.error('Error:', json.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('API error:', err);
  //     });
  // }, [loadFoundationsFromAPI]);

  return (
    <div>
      
      {/* <h2 className="text-xl font-bold mb-4">One Page Strategic Plan</h2>
      {user ? (
        <table className="table-auto border-collapse border border-gray-400">
          <tbody>
            <tr><td className="border p-2">Name</td><td className="border p-2">{user.name}</td></tr>
            <tr><td className="border p-2">Email</td><td className="border p-2">{user.email}</td></tr>
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )} */}

      <HeaderWithPrint />
      {/* <StrategicDriversTable />
      <FoundationsSection />
      <ThreeYearOutlook />
      <PlayingToWin />
      <CoreCapabilities />
      <FourDecisions />
      <ConstraintsTracker /> */}

      {toggles['Strategic Drivers'] && <StrategicDriversTable />}
      {toggles['Foundations'] && <FoundationsSection />}
      {toggles['3 Year Outlook'] && <ThreeYearOutlook />}
      {toggles['Playing to Win Strategy'] && <PlayingToWin />}
      {toggles['Core Capabilities'] && <CoreCapabilities />}
      {toggles['4 Decisions'] && <FourDecisions />}
      {toggles['Constraints Tracker'] && <ConstraintsTracker />}

    </div>
  );
};

export default OnePageStrategicPlan;
