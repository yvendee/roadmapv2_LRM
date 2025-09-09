// frontend\src\components\7A.thirteen-week-sprint\ThirteenWeekSprint.jsx
import React, { useEffect, useState } from 'react';
// import useUserStore from '../../store/userStore';
import ThirteenWeekSprintHeader from './0.13WeekSprintHeader/13WeekSprintHeader';
import WeeklySprintTracker from './1.WeeklySprintTracker/WeeklySprintTracker';
import useWeeklySprintTrackerStore from '../../store/left-lower-content/7A.thirteen-week-sprint/1.WeeklySprintTrackerStore'; 
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';

import './ThirteenWeekSprint.css';

const ThirteenWeekSprint = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const organization = useLayoutSettingsStore((state) => state.organization);
  const setWeeklySprints = useWeeklySprintTrackerStore((state) => state.setWeeklySprints);
  const setBaselineWeeklySprints = useWeeklySprintTrackerStore((state) => state.setBaselineWeeklySprints);


  useEffect(() => {

    const localData = localStorage.getItem('weeklySprintTrackerData');
    if (!localData) {
        
      if (!organization) return;

      const encodedOrg = encodeURIComponent(organization);

      fetch(`${API_URL}/v1/thirteen-week-sprint?organization=${encodedOrg}`, {
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
            ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Thirteen Week Sprint Data:', json);

            if (json) {
              // Assuming the data is an array of weeks (like your initialWeeklySprintData)
              setWeeklySprints(json);
              setBaselineWeeklySprints(json);
            } else {
              console.warn(`⚠️ No thirteenWeekSprintData found for organization: ${organization}`);
              setWeeklySprints([]); // or initial data if you prefer
            }
          } else if (res.status === 401) {
            navigate('/', { state: { loginError: 'Session Expired' } });
          } else {
            console.error('Fetch error:', json.message);
            setError(json.message);
          }
        })
        .catch((err) => {
          console.error('API Error:', err);
          setError(err.message);
        });
    }
  }, [organization, navigate, setWeeklySprints]);


  return (

    <div className="main-content-view">
      <ThirteenWeekSprintHeader />
      <WeeklySprintTracker />
      
      <span>&nbsp;</span>  
    </div>

  );
};

export default ThirteenWeekSprint;
