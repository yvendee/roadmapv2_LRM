//frontend\src\components\document-vault\documentVault.jsx
import React, { useEffect, useState } from 'react';
import DocumentVaultHeader from './0.DocumentVaultHeader/DocumentVaultHeader';
import DocumentVaultTable from './1.DocumentVaultTable/DocumentVaultTable';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import './documentVault.css';

const documentVault = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

    <div className="main-content-view">
      <DocumentVaultHeader />
      <DocumentVaultTable />

      <span>&nbsp;</span>  
    </div>


  );
};

export default documentVault;
