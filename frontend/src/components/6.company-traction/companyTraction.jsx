// frontend\src\components\6.company-traction\companyTraction.jsx
import React, { useEffect, useState } from 'react';
import CompanyTractionHeader from './0.CompanyTractionHeader/CompanyTractionHeader';
import AnnualPriorities from './1.AnnualPriorities/AnnualPriorities';
import CompanyTractionTable from './2.CompanyTraction/CompanyTraction';
import useAnnualPrioritiesStore from '../../store/left-lower-content/6.company-traction/1.annualPrioritiesStore';
import useCompanyTractionStore from '../../store/left-lower-content/6.company-traction/2.companyTractionStore';

import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './companyTraction.css';


const CompanyTraction = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const organization = useLayoutSettingsStore((state) => state.organization);
  const loadAnnualPrioritiesFromAPI = useAnnualPrioritiesStore((state) => state.setAnnualPriorities);
  const setCompanyTraction = useCompanyTractionStore((state) => state.setCompanyTraction);
  const setBaselineCompanyTraction = useCompanyTractionStore((state) => state.setBaselineCompanyTraction);
  // const { setCompanyTraction } = useCompanyTractionStore.getState();



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
 

  return (

    <div className="main-content-view">
      <CompanyTractionHeader />
      <AnnualPriorities />
      <CompanyTractionTable />
      <span>&nbsp;</span>  
    </div>

  );
};

export default CompanyTraction;
