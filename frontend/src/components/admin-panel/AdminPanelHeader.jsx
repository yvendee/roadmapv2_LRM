import React from 'react';
import logo from '../../assets/images/webp/momentum-logo.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AdminPanelHeader({ isMobile, sidebarOpen, toggleSidebar }) {
  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="text-gray-700 dark:text-gray-200 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      {/* Other header content */}
    </header>
  );
}
