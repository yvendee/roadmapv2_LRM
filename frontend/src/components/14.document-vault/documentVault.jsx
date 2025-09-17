// frontend\src\components\14.document-vault\documentVault.jsx
import React, { useEffect, useState } from 'react';
import DocumentVaultHeader from './0.DocumentVaultHeader/DocumentVaultHeader';
import DocumentVaultTable from './1.DocumentVaultTable/DocumentVaultTable';
import useDocumentVaultStore from '../../store/left-lower-content/14.document-vault/1.documentVaultStore';
import useUserStore from '../../store/userStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { useOrganizationUIDStore } from '../../store/layout/organizationUIDStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../configs/config';
import './documentVault.css';

const documentVault = () => {
  const organization = useLayoutSettingsStore((state) => state.organization);
  const setUID = useOrganizationUIDStore((state) => state.setUID);
  const setDocumentVault = useDocumentVaultStore((state) => state.setDocumentVault);
  const setBaselineDocumentVaultTable = useDocumentVaultStore((state) => state.setBaselineDocumentVaultTable)


  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Organization Unique ID
  useEffect(() => {
    if (!organization) return;

    (async () => {
      try {
        // Get CSRF token
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
        if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');
        const { csrf_token } = await csrfRes.json();

        // POST organization to get UID
        const res = await fetch(`${API_URL}/v1/organization-uid`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ organization }),
        });

        if (res.status === 401) {
          navigate('/', { state: { loginError: 'Unauthorized' } });
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch UID');
        }

        const data = await res.json();

        const uid = data[organization]?.uid ?? null;
        setUID(uid);

        ENABLE_CONSOLE_LOGS && console.log('Organization UID fetched:', uid);
      } catch (error) {
        console.error('Error fetching organization UID:', error);
        setUID(null);
      }
    })();
  }, [organization, setUID, navigate]);

  // Fetch Document Vault Table Data
  useEffect(() => {
    const encodedOrg = encodeURIComponent(organization);

    fetch(`${API_URL}/v1/document-vault/list?organization=${encodedOrg}`, {
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
          ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Document Vault:', json);
          if (Array.isArray(json)) {
            setDocumentVault(json);
            setBaselineDocumentVaultTable(json);
          }
        } else if (res.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('Error fetching Document Vault:', json.message);
        }
      })
      .catch((err) => {
        console.error('API error:', err);
      });
  }, [organization]);

  return (

    <div className="main-content-view">
      <DocumentVaultHeader />
      <DocumentVaultTable />

      <span>&nbsp;</span>  
    </div>


  );
};

export default documentVault;
