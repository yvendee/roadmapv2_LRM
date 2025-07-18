// frontend\src\components\5.growth-command-center\growthCommandCenter.jsx
import React, { useEffect, useState } from 'react';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import GrowthCommandCenterHeader from './0.GrowthCommandCenterHeader/GrowthCommandCenterHeader';
import ThreeMetricCards from './1.Metrics/ThreeMetricCards';
import QuarterlyRevenueDashboard from './2.Quarterly Revenue/QuarterlyRevenueDashboard';
import RevenueGrowthChart from './3.RevenueGrowthChart/RevenueGrowthChart';
import useMetricStore from '../../store/left-lower-content/5.growth-command-center/1.metricsStore';
import useRevenueGrowthStore from '../../store/left-lower-content/5.growth-command-center/3.revenueGrowthStore';
// import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './growthCommandCenter.css';

const GrowthCommandCenter = () => {
  // const { user, setUser } = useUserStore();
  // const [error, setError] = useState(null);
  const navigate = useNavigate();
  const organization = useLayoutSettingsStore((state) => state.organization);
  const setMetrics = useMetricStore((state) => state.setMetrics);
  const setRevenueGrowthData = useRevenueGrowthStore((state) => state.setRevenueGrowthData);

  // Fetch Three-Metrics-Cards from API
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);
  
    fetch(`${API_URL}/v1/growth-command-center/metrics?organization=${encodedOrg}`, {
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
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Three-Metrics-Cards:', json);
  
          // 👇 Extract organization-specific data
          const orgMetrics = json[organization];
  
          if (Array.isArray(orgMetrics)) {
            setMetrics(orgMetrics);
          } else {
            console.warn(`⚠️ No Three-Metrics-Cards found for organization: ${organization}`);
          }
        } else if (res.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('❌ Server error:', json.message);
        }
      })
      .catch((err) => {
        console.error('❌ Fetch error:', err);
      });
  }, [organization]);

  // Fetch Revenue-Growth from API
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);

    fetch(`${API_URL}/v1/growth-command-center/revenue-growth?organization=${encodedOrg}`, {
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
          ENABLE_CONSOLE_LOGS && console.log('📊 Fetched Revenue Growth Data:', json);

          setRevenueGrowthData(json);
        } else if (res.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('❌ Server error:', json.message);
        }
      })
      .catch((err) => {
        console.error('❌ Fetch error:', err);
      });
  }, [organization]);

  
  // useEffect(() => {
  //   fetch('/api/mock-response4')
  //     .then((res) => res.json())
  //     .then((json) => setUser(json.data));
  // }, [setUser]);

  // useEffect(() => {
  //   fetch(`${API_URL}/mock-response3`, {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //   }
  //   })
  //   .then(async (res) => {
  //     const json = await res.json();
  //     if (res.ok) {
  //       setUser(json.data);
  //     } else if (res.status === 401) {
  //       // Redirect to login page with error message
  //       // navigate('/', { state: { loginError: json.message || 'Unauthorized' } });
  //       navigate('/', { state: {loginError: 'Session Expired'} });
  //     } else {
  //       setError(json.message || 'Failed to fetch user data');
  //     }
  //   })
  //   .catch((err) => {
  //     console.error('API error:', err);
  //     setError('Something went wrong.');
  //   });
  // }, [setUser]);

  return (
    // <div>
    //   <h2 className="text-xl font-bold mb-4">Scoreboard</h2>
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
      <GrowthCommandCenterHeader />
      <ThreeMetricCards />
      <QuarterlyRevenueDashboard />
      <RevenueGrowthChart />
      <span>&nbsp;</span>  
    </div>


  );
};

export default GrowthCommandCenter;
