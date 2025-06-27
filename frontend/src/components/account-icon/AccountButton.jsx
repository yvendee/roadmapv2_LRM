// frontend/src/components/account-icon/AccountButton.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../configs/config';
// import useUserStore from '../../store/userStore';
import useLoginStore from '../../store/loginStore';
import './AccountButton.css';


const AccountButton = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 
  const user = useLoginStore((state) => state.user);
  // const user = useUserStore((state) => state.user);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Logout failed');

      const data = await response.json();
      if (data.status === 'success') {
        // navigate('/'); 
        navigate('/', { state: {loginError: 'You have successfully logged out'} });
      } else {
        alert('Logout failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Logout error: ' + error.message);
    }
  };
  

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        aria-label="Account"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faUserCircle} size="1x" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <div className="px-4 py-2 text-sm text-gray-900 dark:text-white font-semibold">
            {user?.fullname ?? 'Unknown User'}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 my-1" />

          <div
            className="dropdown-item"
            onClick={() => alert('Change password clicked')}
          >
            Change Password
          </div>
          <div
            className="custom-logout-item"
            onClick={handleLogout}
          >
            Logout
          </div>

        </div>
        
      )}
    </div>
  );
};

export default AccountButton;
