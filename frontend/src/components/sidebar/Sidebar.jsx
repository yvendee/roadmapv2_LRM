// frontend\src\components\sidebar\Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faMap,
  faSyncAlt,
  faTachometerAlt,
  faBuilding,
  faBook,
  faChartBar,
  faListCheck,
  faChartLine,
  faNetworkWired,
  faTasks,
  faCalendar,
  faCheckCircle,
  faWrench,
  faFolder,
  faUserTie 
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import useUserStore from '../../store/userStore';
import useLoginStore from '../../store/loginStore';
import logo from '../../assets/images/webp/momentum-logo.webp';
import { ENABLE_CONSOLE_LOGS } from '../../configs/config';

const Sidebar = ({ collapsed, onShowTooltip, onHideTooltip}) => {

  const handleMouseEnter = (e, text) => {
    const { top, left, height } = e.target.getBoundingClientRect();
    const position = { top: top + height / 2, left: left + 32 }; // Adjust for icon and positioning
    onShowTooltip(position, text);
  };

  const handleMouseLeave = () => {
    onHideTooltip();
  };

  const user = useUserStore((state) => state.user);
  // ENABLE_CONSOLE_LOGS && console.log("Stored User Name:", user?.fullname);

  const loggedUser = useLoginStore((state) => state.user);
  const loggedSession = useLoginStore((state) => state.session_id);
  const isSuperAdmin = loggedUser?.role === 'superadmin'; // Check if the user is a superadmin

  // ENABLE_CONSOLE_LOGS && console.log("Logged Email: ", loggedUser?.email);  
  // ENABLE_CONSOLE_LOGS && console.log("Logged Role: ",loggedUser?.role);   
  // ENABLE_CONSOLE_LOGS && console.log("Logged Group: ",loggedUser?.group);
  // ENABLE_CONSOLE_LOGS && console.log("Logged Organization: ",loggedUser?.organization);
  // ENABLE_CONSOLE_LOGS && console.log("Logged Session: ", loggedSession); 


  return (

<div
  className="sidebar-scroll h-screen overflow-hidden"
  onMouseEnter={(e) => (e.currentTarget.style.overflowY = 'auto')}
  onMouseLeave={(e) => (e.currentTarget.style.overflowY = 'hidden')}
>
    <div
      className={`group ${collapsed ? 'w-16' : 'w-48'} 
        bg-gray-200 dark:bg-gray-800 box-border flex flex-col p-4 transition-all duration-300 min-h-full`}
    >

      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <img
          src={logo}
          alt="MomentumOS"
          className={`transition-all duration-300 ${
            collapsed ? 'h-8' : 'h-10'
          } rounded-lg`}
        />
      </div>

      <nav className="space-y-2 ">
          {/* Section: Overview */}
          {!collapsed && (
            <p className="text-xs uppercase font-semibold text-gray-500 px-2 mb-1">Overview</p>
          )}
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Home')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faHouse} />
            {!collapsed && <span>Home</span>}
          </NavLink>

          {/* Section: Strategic Planning */}
          {!collapsed && (
            <p className="text-xs uppercase font-semibold text-gray-500 mt-4 px-2 mb-1">Strategic Planning</p>
          )}
          <NavLink
            to="/one-page-strategic-plan"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'One Page Strategic Plan')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
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
            onMouseEnter={(e) => handleMouseEnter(e, 'Flywheel')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faSyncAlt} />
            {!collapsed && <span>Flywheel</span>}
          </NavLink>

          {/* Section: Performance & Progress */}
          {!collapsed && (
            <p className="text-xs uppercase font-semibold text-gray-500 mt-4 px-2 mb-1">Performance & Progress</p>
          )}
          <NavLink
            to="/scoreboard"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Score Board')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faTachometerAlt} />
            {!collapsed && <span>Scoreboard</span>}
          </NavLink>

          {isSuperAdmin && (
            <NavLink
            to="/growth-command-center"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Growth Command Center')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
            >
            <FontAwesomeIcon icon={faBuilding} />
            {!collapsed && <span>Growth Command Center</span>}
            </NavLink>
          )}

          <NavLink
            to="/company-traction"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Compay Traction')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faChartBar} />
            {!collapsed && <span>Company Traction</span>}
          </NavLink>

          <NavLink
            to="/department-traction"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Department Traction')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faChartLine} />
            {!collapsed && <span>Department Traction</span>}
          </NavLink>


          <NavLink
            to="/13-week-sprint"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, '13 Week Sprint')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faListCheck} />
            {!collapsed && <span>13 Week Sprint</span>}
          </NavLink>

          <NavLink
            to="/who-what-when"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Who What When')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faNetworkWired} />
            {!collapsed && <span>Who What When</span>}
          </NavLink>

          {/* Section: Meeting Hub */}
          {!collapsed && (
            <p className="text-xs uppercase font-semibold text-gray-500 mt-4 px-2 mb-1">Meeting Hub</p>
          )}

          <NavLink
            to="/session-dates"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Session Dates')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faTasks} />
            {!collapsed && <span>Session Dates</span>}
          </NavLink>

          <NavLink
            to="/meetings"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Meetings')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faCalendar} />
            {!collapsed && <span>Meetings</span>}
          </NavLink>
        
          {/* Section: Coach's Corner */}
          {!collapsed && (
            <p className="text-xs uppercase font-semibold text-gray-500 mt-4 px-2 mb-1">Coach's Corner</p>
          )}

          <NavLink
            to="/coaching-checklist"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Coaching Checklist')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
            {!collapsed && <span>Coaching Checklist</span>}
          </NavLink>

          {isSuperAdmin && (
            <NavLink
            to="/coaching-alignment"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Coaching Alignment')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
            >
            <FontAwesomeIcon icon={faBook} />
            {!collapsed && <span>Coaching Alignment</span>}
            </NavLink>
          )}

          <NavLink
            to="/tools"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Tools')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faWrench} />
            {!collapsed && <span>Tools</span>}
          </NavLink>

          {/* Section: Document Vault */}
          {!collapsed && (
            <p className="text-xs uppercase font-semibold text-gray-500 mt-4 px-2 mb-1">Document Vault</p>
          )}
          
          <NavLink
            to="/document-vault"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Document Vault')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faFolder} />
            {!collapsed && <span>Document Vault</span>}
          </NavLink>


          {/* Section: Members */}
          {!collapsed && (
            <p className="text-xs uppercase font-semibold text-gray-500 mt-4 px-2 mb-1">Members</p>
          )}

          <NavLink
            to="/members-departments"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Members Departments')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faBuilding} />
            {!collapsed && <span>Member's Departments</span>}
          </NavLink>

          <NavLink
            to="/members-directory"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-700 text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`
            }
            onMouseEnter={(e) => handleMouseEnter(e, 'Members Directory')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faUserTie} />
            {!collapsed && <span>Member's Directory</span>}
          </NavLink>


      </nav>

    </div>
  </div>
  );
};

export default Sidebar;
