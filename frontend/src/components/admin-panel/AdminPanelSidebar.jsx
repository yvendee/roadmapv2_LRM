// frontend/src/components/admin-panel/AdminPanelSidebar.jsx
import React from 'react';
import logo from '../../assets/images/webp/momentum-logo.webp'; // ✅ Import logo

const MENU_ITEMS = [
  'Dashboard',
  'Growth Goals',
  'Key Thrust Strategic Drivers',
  'Strategic Alignments',
  'Annual Priorities',
  'Core Values',
  'Foundational Documents',
  'Win Strategies',
  'Monthly Meetings',
  'Quarterly Meetings',
  'Companies',
  'Users',
  'Roles',
  'Table Headers',
];

export default function AdminPanelSidebar({ sidebarOpen, selectedItem, setSelectedItem }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col md:w-64`}
    >
      {/* Logo section */}
      <div className="flex items-center justify-center h-20 px-4 border-b border-gray-200 dark:border-gray-700">
        <img
          src={logo}
          alt="Momentum Logo"
          className="h-10 object-contain"
        />
      </div>

      {/* Menu items */}
      <nav className="flex flex-col flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {MENU_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => setSelectedItem(item)}
            className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
              ${
                selectedItem === item
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
