// frontend\src\components\6.company-traction\companyTraction.jsx
import React, { useEffect, useState } from 'react';
import CompanyTractionHeader from './0.CompanyTractionHeader/CompanyTractionHeader';
import AnnualPriorities from './1.AnnualPriorities/AnnualPriorities';
import CompanyTractionTable from './2.CompanyTraction/CompanyTraction';
import useAnnualPrioritiesStore from '../../store/left-lower-content/6.company-traction/1.annualPrioritiesStore';
import useCompanyTractionStore from '../../store/left-lower-content/6.company-traction/2.companyTractionStore';
import useCompanyActivityLogStore from '../../store/left-lower-content/6.company-traction/3.activityLogStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import logo from '../../assets/images/webp/momentum-logo.webp'; 
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './companyTraction.css';


const CompanyTraction = () => {
  const [printMode, setPrintMode] = useState(null); // 'annual' | 'traction' | null
  const navigate = useNavigate();
  const organization = useLayoutSettingsStore((state) => state.organization);
  const loadAnnualPrioritiesFromAPI = useAnnualPrioritiesStore((state) => state.setAnnualPriorities);
  const setCompanyTraction = useCompanyTractionStore((state) => state.setCompanyTraction);
  const setBaselineCompanyTraction = useCompanyTractionStore((state) => state.setBaselineCompanyTraction);
  // const { setCompanyTraction } = useCompanyTractionStore.getState();


  // Allow header to trigger this
  useEffect(() => {
    const handleCustomPrint = (event) => {
      const type = event.detail?.type;
      if (type === 'annual' || type === 'traction') {
        setPrintMode(type);

        // Wait a tick to allow the component to re-render before printing
        setTimeout(() => {
          window.print();
          setPrintMode(null); // Reset after print
        }, 100);
      }
    };

    window.addEventListener('print-section', handleCustomPrint);
    return () => window.removeEventListener('print-section', handleCustomPrint);
  }, []);


  // Fetch Annual-Priorities
  useEffect(() => {

    const stored = localStorage.getItem('annualPrioritiesData');
    if (!stored) {
      const encodedOrg = encodeURIComponent(organization);
    
      fetch(`${API_URL}/v1/company-traction/annual-priorities?organization=${encodedOrg}`, {
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
            const annualprioritiesArr = json;
            ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Annual-Priorities data:', annualprioritiesArr);
            if (Array.isArray(annualprioritiesArr)) {
              loadAnnualPrioritiesFromAPI(annualprioritiesArr);
            } else {
              console.error(`⚠️ No Annual-Priorities found for organization: ${organization}`);
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
    }
  }, [organization]);
  

  // Fetch Company-Traction-Table
  useEffect(() => {

    const localData = localStorage.getItem('companyTractionData');
    if (!localData) {

      const encodedOrg = encodeURIComponent(organization);

      fetch(`${API_URL}/v1/company-traction/traction-data?organization=${encodedOrg}`, {
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
            ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Company Traction Table:', json);
            setCompanyTraction(json);
            setBaselineCompanyTraction(json);

            // setCompanyTraction({
            //   Q1: [],
            //   Q2: [],
            //   Q3: [],
            //   Q4: [],
            // });

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
 


  // Fetch Company-Traction Activity logs
  useEffect(() => {
    const fetchCompanyActivityLogs = async () => {
      try {
        // 1. Get CSRF token
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
  
        if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');
        const { csrf_token } = await csrfRes.json();
  
        // 2. Make request with CSRF token
        const res = await fetch(`${API_URL}/v1/company-traction/activity-logs`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({ organizationName: organization }),
        });
  
        const json = await res.json();
  
        if (res.ok) {
          ENABLE_CONSOLE_LOGS && console.log('📥 Company Activity Logs:', json);
          useCompanyActivityLogStore.setState({ activityLogs: json.activityLogs });
        } else if (res.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('Company activity logs fetch failed:', json.message);
        }
      } catch (err) {
        console.error('Company activity logs fetch error:', err);
      }
    };
  
    fetchCompanyActivityLogs();
  }, [organization]);
  

  return (

    <div className="main-content-view">
      <CompanyTractionHeader />
      {/* <AnnualPriorities />
      <CompanyTractionTable /> */}

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
            <AnnualPriorities />
            <CompanyTractionTable />
          </>
        )}

        {printMode === 'annual' && <AnnualPriorities />}
        {printMode === 'traction' && <CompanyTractionTable />}
      </div>

      <span>&nbsp;</span>  
    </div>

  );
};

export default CompanyTraction;
