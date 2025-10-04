import React from 'react';

export default function AdminPanelHeader({ isMobile, sidebarOpen, toggleSidebar }) {
  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="text-gray-700 dark:text-gray-200 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        {/* Custom SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-panel-left"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
        </svg>
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
