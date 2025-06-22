// frontend\src\components\sidebar\Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faComments, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import useUserStore from '../../store/userStore';

const Sidebar = ({ collapsed }) => {

  const { user } = useUserStore();
  console.log(user?.name); // Will show "Sample User" after it's fetched in Review

  return (
    <div
      className={`${
        collapsed ? 'w-16' : 'w-48'
      } bg-gray-200 dark:bg-gray-800 h-screen p-4 flex flex-col transition-all duration-300`}
    >
      <nav className="mt-12 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-2 ${
              isActive
                ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <FontAwesomeIcon icon={faHouse} />
          {!collapsed && <span>Home</span>}
        </NavLink>

        <NavLink
          to="/review"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-2 ${
              isActive
                ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <FontAwesomeIcon icon={faClipboardList} />
          {!collapsed && <span>Review</span>}
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-2 ${
              isActive
                ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <FontAwesomeIcon icon={faComments} />
          {!collapsed && <span>Chat</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
