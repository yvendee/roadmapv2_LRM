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
import useFoundationsStore from '../../store/left-lower-content/2.one-page-strategic-plan/2.foundationsStore';
import useThreeYearOutlookStore from '../../store/left-lower-content/2.one-page-strategic-plan/3.threeYearOutlookStore';
import usePlayingToWinStore from '../../store/left-lower-content/2.one-page-strategic-plan/4.playingToWinStore';
import useCoreCapabilitiesStore from '../../store/left-lower-content/2.one-page-strategic-plan/5.coreCapabilitiesStore';
import useFourDecisions from '../../store/left-lower-content/2.one-page-strategic-plan/6.fourDecisionsStore';
import useConstraintsTracker from '../../store/left-lower-content/2.one-page-strategic-plan/7.constraintsTrackerStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { useNavigate } from 'react-router-dom'; 
import './onePageStrategicPlan.css';


const OnePageStrategicPlan = () => {
  const { user, setUser } = useUserStore();
  const loadStrategicDriversFromAPI = useStrategicDriversStore((state) => state.loadStrategicDriversFromAPI);
  const loadFoundationsFromAPI = useFoundationsStore((state) => state.loadFoundationsFromAPI);
  const loadOutlooksFromAPI = useThreeYearOutlookStore((state) => state.setOutlooks);
  const loadPlayingToWinFromAPI = usePlayingToWinStore((state) => state.setPlayingToWin);
  const loadCoreCapabilitieFromAPI = useCoreCapabilitiesStore((state) => state.setCoreCapabilities);
  const loadFourDesicionsFromAPI = useFourDecisions((state) => state.setFourDecisions);
  const loadConstraintsTrackerFromAPI = useConstraintsTracker((state) => state.setConstraintsTracker);



  const navigate = useNavigate(); // Ensure it's inside your component
  const toggles = useLayoutSettingsStore((state) => state.toggles);
  const organization = useLayoutSettingsStore((state) => state.organization);

  // useEffect(() => {
  //   fetch(`${API_URL}/mock-response2`)
  //     .then((res) => res.json())
  //     .then((json) => setUser(json.data));
  // }, [setUser]);

  // StrategicDrivers
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);
  
    fetch(`${API_URL}/v1/one-page-strategic-plan/strategic-drivers?organization=${encodedOrg}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // important for Laravel session cookies
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) {
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Strategic-Drivers data:', json);
          loadStrategicDriversFromAPI(json); // Assuming this function is imported from store
        } else if (res.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('Error:', json.message);
        }
      })
      .catch((err) => {
        console.error('API error:', err);
      });
  }, [organization, loadStrategicDriversFromAPI, navigate]);
  

  //Foundations
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);
  
    fetch(`${API_URL}/v1/one-page-strategic-plan/foundations?organization=${encodedOrg}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) {
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Foundations data:', json);
          loadFoundationsFromAPI(json);
        } else if (res.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('Error:', json.message);
        }
      })
      .catch((err) => {
        console.error('API error:', err);
      });
  }, [organization, loadFoundationsFromAPI, navigate]);
  

  // Three-Year-Outlook
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);
  
    fetch(`${API_URL}/v1/one-page-strategic-plan/three-year-outlook?organization=${encodedOrg}`, {
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
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched 3-Year-Outlook data:', json);
  
          const outlookArr = json[organization];
  
          if (Array.isArray(outlookArr)) {
            loadOutlooksFromAPI(outlookArr);
          } else {
            console.error(`⚠️ No outlooks found for organization: ${organization}`);
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
  }, [organization, loadOutlooksFromAPI, navigate]);
  

  // Playing-To-Win
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);
  
    fetch(`${API_URL}/v1/one-page-strategic-plan/playing-to-win?organization=${encodedOrg}`, {
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
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Playing-To-Win data:', json);
  
          const playingToWinArr = json[organization];
  
          if (Array.isArray(playingToWinArr)) {
            loadPlayingToWinFromAPI(playingToWinArr);
          } else {
            console.error(`⚠️ No Playing-To-Win found for organization: ${organization}`);
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
  }, [organization, loadPlayingToWinFromAPI, navigate]);
  
  // Core-Capabilities
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);
  
    fetch(`${API_URL}/v1/one-page-strategic-plan/core-capabilities?organization=${encodedOrg}`, {
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
          const capabilitiesArr = json[organization];
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Core-Capabilities data:', capabilitiesArr);
          if (Array.isArray(capabilitiesArr)) {
            loadCoreCapabilitieFromAPI(capabilitiesArr);
          } else {
            console.error(`⚠️ No Core-Capabilities found for organization: ${organization}`);
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

  // Four-Decisions
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);
    fetch(`${API_URL}/v1/one-page-strategic-plan/four-decisions?organization=${encodedOrg}`, {
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
          const decisionsArr = json[organization];
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Four-Decisions data:', decisionsArr);
          if (Array.isArray(decisionsArr)) {
            loadFourDesicionsFromAPI(decisionsArr); 
          } else {
            console.error(`⚠️ No Four-Decisions found for organization: ${organization}`);
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
  
  // Constraints-Tracker
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);
    fetch(`${API_URL}/v1/one-page-strategic-plan/constraints-tracker?organization=${encodedOrg}`, {
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
          const constraintsArr = json[organization];
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Constraints Tracker data:', constraintsArr);
          if (Array.isArray(constraintsArr)) {
            loadConstraintsTrackerFromAPI(constraintsArr); 
          } else {
            console.error(`⚠️ No Constraints Tracker data found for organization: ${organization}`);
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
