// frontend/src/components/admin-panel/AdminPanelHeader.jsx
import React from 'react';
import logo from '../../assets/images/webp/momentum-logo.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AdminPanelHeader({ isMobile, sidebarOpen, toggleSidebar }) {
  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 h-14 shadow-sm sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
          </button>
        )}
        <img src={logo} alt="Momentum OS" className="h-8 w-auto" />
      </div>

      <div>
        <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-semibold text-gray-700 dark:text-gray-200 cursor-pointer select-none">
          MA
        </div>
      </div>
    </header>
  );
}
