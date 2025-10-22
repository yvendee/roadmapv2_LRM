//frontend\src\components\department-traction\departmentTraction.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import DepartmentTractionHeader from './0.DepartmentTractionHeader/DepartmentTractionHeader';
import DepartmentAnnualPriorities from './1.DepartmentAnnualPriorities/DepartmentAnnualPriorities';
import DepartmentTractionTable from './2.DepartmentTraction/DepartmentTraction';
import useDepartmentAnnualPrioritiesStore from '../../store/left-lower-content/7.department-traction/1.departmentAnnualPrioritiesStores';
import useDepartmentTractionStore from '../../store/left-lower-content/7.department-traction/2.departmentTractionStore';
import useDepartmentActivityLogStore from '../../store/left-lower-content/7.department-traction/3.activityLogStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import logo from '../../assets/images/webp/momentum-logo.webp'; 
import './departmentTraction.css';

const DepartmentTraction = () => {
  const [printMode, setPrintMode] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const organization = useLayoutSettingsStore((state) => state.organization);
  const loadDepartmentAnnualPrioritiesFromAPI = useDepartmentAnnualPrioritiesStore((state) => state.loadDepartmentAnnualPrioritiesFromAPI);
  const setDepartmentTraction = useDepartmentTractionStore((state) => state.setDepartmentTraction);
  const setBaselineDepartmentTraction = useDepartmentTractionStore((state) => state.setBaselineDepartmentTraction);
  

   // Listen for custom print event
   useEffect(() => {
    const handlePrintEvent = (event) => {
      const type = event.detail?.type;
      if (type === 'department-annual' || type === 'department-traction') {
        setPrintMode(type);

        setTimeout(() => {
          window.print();
          setPrintMode(null);
        }, 100);
      }
    };

    window.addEventListener('print-section', handlePrintEvent);
    return () => window.removeEventListener('print-section', handlePrintEvent);
  }, []);
  
  // Fetch Department-Annual-Priorities
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);

    const localData = localStorage.getItem('departmentAnnualPrioritiesData');
    if (!localData) {

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
    }
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
  
  // Fetch Department-Traction Activity logs
  useEffect(() => {
    const fetchDepartmentActivityLogs = async () => {
      const encodedOrg = encodeURIComponent(organization);
  
      try {
        const res = await fetch(`${API_URL}/v1/department-traction/activity-logs`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ organizationName: organization }),
        });
  
        const json = await res.json();
  
        if (res.ok) {
          ENABLE_CONSOLE_LOGS && console.log('📥 Department Activity Logs:', json);
          useDepartmentActivityLogStore.setState({ activityLogs: json.activityLogs });
        } else if (res.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('Department traction logs fetch failed:', json.message);
        }
      } catch (error) {
        console.error('Department traction logs fetch error:', error);
      }
    };
  
    fetchDepartmentActivityLogs();
  }, [organization]);

  return (

    <div className="main-content-view">
      <DepartmentTractionHeader />
      {/* <DepartmentAnnualPriorities />
      <DepartmentTractionTable /> */}

      <div id="print-area" className="p-4">
        <div className="print-logo-container" style={{ display: 'none' }}>
          <img
            src={logo}
            alt="MomentumOS"
            style={{ height: '40px', position: 'absolute', top: '10px', left: '10px' }}
          />
        </div>
        <br />
        <br />

        {printMode === null && (
          <>
            <DepartmentAnnualPriorities />
            <DepartmentTractionTable />
          </>
        )}

        {printMode === 'department-annual' && <DepartmentAnnualPriorities />}
        {printMode === 'department-traction' && <DepartmentTractionTable />}
      </div>

      <span>&nbsp;</span>  
    </div>

  );
};

export default DepartmentTraction;
