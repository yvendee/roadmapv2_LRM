import React from 'react';
import PanelLeftIcon from '../../assets/images/svg/PanelLeftIcon';

export default function AdminPanelHeader({ isMobile, sidebarOpen, toggleSidebar }) {
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

      {/* Circular profile image */}
      <img
        src="https://i.pravatar.cc/40"
        alt="User Profile"
        className="w-10 h-10 rounded-full object-cover mr-4 mt-0.5"
      />
    </header>
  );
}
