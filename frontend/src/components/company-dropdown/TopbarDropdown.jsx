// frontend\src\components\company-dropdown\TopbarDropdown.jsx
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useCompanyFilterStore } from '../../store/layout/companyFilterStore';
import useLoginStore from '../../store/loginStore'; 
import { ENABLE_CONSOLE_LOGS } from '../../configs/config';
import API_URL from '../../configs/config';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { useCompanyTractionUserStore } from '../../store/layout/companyTractionUserStore';
import './TopbarDropdown.css';
import { useNavigate } from 'react-router-dom'; 

const TopbarDropdown = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { options, selected, setSelected, setOptions } = useCompanyFilterStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orgListLoaded, setOrgListLoaded] = useState(false);

  const setToggles = useLayoutSettingsStore((state) => state.setToggles);
  const setOrganization = useLayoutSettingsStore((state) => state.setOrganization);
  const setUniqueId = useLayoutSettingsStore((state) => state.setUniqueId);

  const loggedUser = useLoginStore((state) => state.user); 
  const loggedUserEmail = useLoginStore((state) => state.email);

  const position = loggedUser?.position;
  const hideTopBarDropdown = ['Admin', 'CEO', 'Internal'].includes(position);

  // 🧩 If user is not superadmin, fetch their organization association list
  useEffect(() => {
    const fetchOrganizationAssociation = async () => {
      if (!loggedUser || loggedUser?.role === 'superadmin') return;
      if (!loggedUserEmail) return;

      try {
        const response = await fetch(`${API_URL}/v1/organization-association`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loggedUserEmail }),
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          const orgList = result.organizationAssociation || [];
          ENABLE_CONSOLE_LOGS && console.log('Fetched organizationAssociation:', orgList);

          if (orgList.length > 0) {
            setOptions(orgList);
            setSelected(orgList[0]); // default first one
          }
          setOrgListLoaded(true);
        } else {
          ENABLE_CONSOLE_LOGS && console.log('No organizationAssociation found.');
          setOrgListLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching organizationAssociation:', error);
        setOrgListLoaded(true);
      }
    };

    fetchOrganizationAssociation();
  }, [loggedUser, loggedUserEmail, setOptions, setSelected]);

  // 🛑 If not superadmin and no organization list available, render a placeholder
  if (loggedUser?.role !== 'superadmin') {
    if (!orgListLoaded) {
      // Still loading, show nothing or a loader here
      return null;
    } else if (options.length === 0) {
      // If the organization list is empty, render blank space
      return <div className="w-full h-12 bg-white dark:bg-gray-800" />;
    } else if (options.length > 0) {
      // If there are organizations, render the dropdown
      return (
        <div ref={dropdownRef} className="relative flex items-center space-x-2 w-auto">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Company Filter:
          </label>

          <div
            className="relative bg-white dark:bg-gray-800 border dark:border-gray-600 px-3 py-2 rounded cursor-pointer text-sm text-gray-800 dark:text-gray-100 flex justify-between items-center whitespace-nowrap"
            onClick={toggleDropdown}
          >
            {selected}
            <span className="mx-1">&nbsp;</span>
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
          </div>

          {loading && (
            <div className="loader-balls">
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}

          {isOpen && (
            <ul
              className="company-dropdown-scroll absolute top-10 left-[95px] z-10 mt-1 max-h-100 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow text-sm"
              onMouseEnter={(e) => (e.currentTarget.style.overflowY = 'auto')}
              onMouseLeave={(e) => (e.currentTarget.style.overflowY = 'hidden')}
              style={{ minWidth: '100%' }}
            >
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelect(option)}
                  className="dropdown-item"
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
  }

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = async (option) => {
    ENABLE_CONSOLE_LOGS && console.log('Selected company filter:', option);
    setSelected(option);
    setIsOpen(false);
    setLoading(true);

    setTimeout(async () => {
      try {
        // ✅ Step 1: Fetch Layout Toggles
        const response = await fetch(`${API_URL}/v1/get-layout-toggles?organization=${encodeURIComponent(option)}`);
        const result = await response.json();

        if (response.ok) {
          if (result.status === 'success') {
            setToggles(result.toggles);
            setOrganization(result.organization);
            setUniqueId(result.unique_id);
            ENABLE_CONSOLE_LOGS && console.log('Fetched toggles:', result.toggles);
          } else {
            console.error('Error fetching toggles:', result.message);
          }
        } else if (response.status === 401) {
          navigate('/', { state: { loginError: 'Session Expired' } });
        } else {
          console.error('Server error:', result.message);
        }

        // ✅ Step 2: Fetch Company Traction Users
        try {
          const tractionUserRes = await fetch(
            `${API_URL}/v1/company-traction-users?organizationName=${encodeURIComponent(option)}`,
            {
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );

          if (!tractionUserRes.ok) throw new Error('Traction users fetch failed');

          const tractionUsers = await tractionUserRes.json();
          ENABLE_CONSOLE_LOGS && console.log('Fetched Traction Users:', tractionUsers);

          const firstUser = tractionUsers[0] || null;

          useCompanyTractionUserStore.setState({
            users: tractionUsers,
            selectedUser: firstUser,
          });
        } catch (tractionErr) {
          console.error('Error fetching traction users:', tractionErr);
        }
      } catch (error) {
        console.error('Network error:', error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return null; // Return null if there is no condition to render
};

export default TopbarDropdown;
