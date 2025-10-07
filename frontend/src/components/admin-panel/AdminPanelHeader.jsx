import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../../store/loginStore';
import PanelLeftIcon from '../../assets/images/svg/PanelLeftIcon';
import { FaUser, FaGlobe, FaSignOutAlt } from 'react-icons/fa';
import './AdminPanelHeader.css'; // Include the custom CSS below

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminPanelHeader({ isMobile, sidebarOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const user = useLoginStore((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
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
        navigate('/', { state: { loginError: 'You have successfully logged out' } });
      } else {
        alert('Logout failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Logout error: ' + error.message);
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="text-gray-700 dark:text-gray-200 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <PanelLeftIcon width={24} height={24} />
      </button>

      {/* Profile image with dropdown */}
      <div className="relative" ref={dropdownRef}>
        <img
          src="https://i.pravatar.cc/40"
          alt="User Profile"
          className="w-10 h-10 rounded-full object-cover mr-4 mt-0.5 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-white border-b border-gray-100 dark:border-gray-600 flex items-center gap-2">
              <FaUser /> {user?.fullname || 'Unknown User'}
            </div>
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate('/home');
              }}
              className="dropdown-item"
            >
              <FaGlobe />
              Client Portal
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false);
                handleLogout();
              }}
              className="dropdown-item"
            >
              <FaSignOutAlt />
              Signout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
