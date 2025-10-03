// frontend/src/components/admin-panel/AdminPanelSidebar.jsx
import React from 'react';
import logo from '../../assets/images/webp/momentum-logo.webp';
import { FaBars, FaTachometerAlt, FaBullseye, FaCogs, FaHandshake, FaCalendarAlt, FaBuilding, FaUsers, FaUserShield, FaTable, FaFileAlt, FaLightbulb, FaRocket, FaCheckCircle } from 'react-icons/fa';

const MENU_ITEMS = [
  { label: 'Dashboard', icon: <FaTachometerAlt /> },
  { label: 'Growth Goals', icon: <FaRocket /> },
  { label: 'Key Thrust Strategic Drivers', icon: <FaBullseye /> },
  { label: 'Strategic Alignments', icon: <FaCogs /> },
  { label: 'Annual Priorities', icon: <FaCheckCircle /> },
  { label: 'Core Values', icon: <FaLightbulb /> },
  { label: 'Foundational Documents', icon: <FaFileAlt /> },
  { label: 'Win Strategies', icon: <FaHandshake /> },
  { label: 'Monthly Meetings', icon: <FaCalendarAlt /> },
  { label: 'Quarterly Meetings', icon: <FaCalendarAlt /> },
  { label: 'Companies', icon: <FaBuilding /> },
  { label: 'Users', icon: <FaUsers /> },
  { label: 'Roles', icon: <FaUserShield /> },
  { label: 'Table Headers', icon: <FaTable /> },
];

export default function AdminPanelSidebar({
  sidebarOpen,
  selectedItem,
  setSelectedItem,
  onToggleSidebar,
}) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col md:w-64`}
    >
      {/* Logo + Toggle button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <img
          src={logo}
          alt="Momentum Logo"
          className="h-8 object-contain"
        />
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex flex-col flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {MENU_ITEMS.map(({ label, icon }) => (
          <button
            key={label}
            onClick={() => setSelectedItem(label)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-full
              ${
                selectedItem === label
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
