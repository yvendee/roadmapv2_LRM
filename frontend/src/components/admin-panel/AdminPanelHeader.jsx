// frontend/src/components/admin-panel/AdminPanelHeader.jsx
import React from 'react';
import logo from '../../assets/images/webp/momentum-logo.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AdminPanelHeader({ isMobile, sidebarOpen, toggleSidebar }) {
  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      
      {/* Sidebar toggle button - visible on all screen sizes */}
      <button
        onClick={toggleSidebar}
        className="text-gray-700 dark:text-gray-200 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        {/* Use an icon here, e.g., hamburger or chevron */}
        <FaBars size={20} />
      </button>

      {/* Your other header content here */}
    </header>
  );
}

