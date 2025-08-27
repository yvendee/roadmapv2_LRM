// frontend\src\components\company-dropdown\TopbarDropdown.jsx
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useCompanyFilterStore } from '../../store/layout/companyFilterStore';
import useLoginStore from '../../store/loginStore'; 
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import API_URL from '../../configs/config';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './TopbarDropdown.css';
import { useNavigate } from 'react-router-dom'; 

const TopbarDropdown = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { options, selected, setSelected } = useCompanyFilterStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const setToggles = useLayoutSettingsStore((state) => state.setToggles);
  const setOrganization = useLayoutSettingsStore((state) => state.setOrganization);
  const setUniqueId = useLayoutSettingsStore((state) => state.setUniqueId);

  const loggedUser = useLoginStore((state) => state.user); 

  // 🔒 Only show if superadmin
  // if (loggedUser?.role !== 'superadmin') return null;
  if (loggedUser?.role !== 'superadmin') return <span>&nbsp;</span>;

  const handleSelect = async (option) => {
    ENABLE_CONSOLE_LOGS && console.log('Selected company filter:', option);
    setSelected(option);
    setIsOpen(false);
    setLoading(true);

    // Simulate a delay before fetching
    setTimeout(async () => {
      try {
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
      } catch (error) {
        console.error('Network error:', error);
      } finally {
        setLoading(false);
      }
    }, 1000);



  };



  
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex items-center space-x-2 w-auto">
      <p>&nbsp;</p>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Company Filter:
      </label>

      <div
        // className="relative bg-white dark:bg-gray-800 border dark:border-gray-600 px-3 py-2 rounded cursor-pointer text-sm text-gray-800 dark:text-gray-100 flex justify-between items-center whitespace-nowrap"
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
};

export default TopbarDropdown;
