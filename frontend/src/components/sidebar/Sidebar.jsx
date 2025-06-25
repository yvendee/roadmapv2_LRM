// frontend\src\components\sidebar\Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faComments, faClipboardList, faMap, faSyncAlt, faTachometerAlt, faChartBar } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import useUserStore from '../../store/userStore';
import useLoginStore from '../../store/loginStore';

const Sidebar = ({ collapsed }) => {

  const { user } = useUserStore();
  console.log(user?.name); // Will show "Sample User" after it's fetched in Review

  const loggedUser = useLoginStore((state) => state.user);
  const loggedSession = useLoginStore((state) => state.session_id);
  console.log("Logged Email: ", loggedUser?.email);  
  console.log("Logged Role: ",loggedUser?.role);   
  console.log("Logged Group: ",loggedUser?.group);
  console.log("Logged Session: ", loggedSession); 

  return (
    <div
      className={`${
        collapsed ? 'w-16' : 'w-48'
      } bg-gray-200 dark:bg-gray-800 h-screen p-4 flex flex-col transition-all duration-300`}
    >
      <nav className="mt-12 space-y-2">
        <NavLink
          to="/home"
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
          to="/one-page-strategic-plan"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-2 ${
              isActive
                ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <FontAwesomeIcon icon={faMap} />
          {!collapsed && <span>One Page Strategic Plan</span>}
        </NavLink>

        <NavLink
          to="/flywheel"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-2 ${
              isActive
                ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <FontAwesomeIcon icon={faSyncAlt} />
          {!collapsed && <span>Flywheel</span>}
        </NavLink>

        <NavLink
          to="/scoreboard"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-2 ${
              isActive
                ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <FontAwesomeIcon icon={faTachometerAlt} />
          {!collapsed && <span>Scoreboard</span>}
        </NavLink>

        <NavLink
          to="/company-traction"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-2 ${
              isActive
                ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <FontAwesomeIcon icon={faChartBar} />
          {!collapsed && <span>Company Traction</span>}
        </NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;
