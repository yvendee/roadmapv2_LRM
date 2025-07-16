// frontend\src\App.jsx
// Layout file
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Sidebar from './components/sidebar/Sidebar';
import Home from './components/1.home/Home';
import Review from './components/review/Review';
import OnePageStrategicPlan from './components/2.one-page-strategic-plan/onePageStrategicPlan';
import Flywheel from './components/3.flywheel/Flywheel';
import Scoreboard from './components/4.scoreboard/Scoreboard';
import GrowthCommandCenter from './components/5.growth-command-center/growthCommandCenter';
import CompanyTraction from './components/company-traction/companyTraction';
import DepartmentTraction from './components/department-traction/departmentTraction';
import WhoWhatWhen from './components/who-what-when/whoWhatWhen';
import SessionDates from './components/session-dates/sessionDates';
import Meetings from './components/meetings/meetings';
import CoachingChecklist from './components/coaching-checklist/coachingChecklist';
import Tools from './components/tools/tools';
import DocumentVault from './components/document-vault/documentVault';
import MembersDepartments from './components/members-departments/membersDepartments';
import MembersDirectory from './components/members-directory/membersDirectory';
import Chat from './components/chat/Chat';
import TopbarDropdown from './components/company-dropdown/TopbarDropdown';
import ThemeToggle from './components/theme-icon/ThemeToggle';
import LayoutButton from './components/layout-icon/LayoutButton';
import SettingsButton from './components/settings-icon/SettingsButton';
import MessageButton from './components/message-icon/MessageButton';
import NotificationButton from './components/notification-icon/NotificationButton';
import AccountButton from './components/account-icon/AccountButton';
import Tooltip from './components/tooltip/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import useLoginStore from './store/loginStore';
import useSessionKeepAlive from './hooks/KeepAlive';
import './index.css';

function Layout({ isDark, setIsDark, collapsed, setCollapsed }) {

  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const loggedUser = useLoginStore((state) => state.user); // Assuming user data includes role
  const isSuperAdmin = loggedUser?.role === 'superadmin'; // Check if the user is a superadmin
  const isStrategicPlanPage = location.pathname === '/one-page-strategic-plan'; // Check if on the right page


  useSessionKeepAlive();

  // 👇 Force light mode on login page
  useEffect(() => {
    if (isLoginPage) {
      setIsDark(false);
    } else {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }, [isLoginPage, isDark]);



  const [tooltip, setTooltip] = useState({ show: false, position: {}, text: '' });
  
  // Tooltip handling functions
  const showTooltipHandler = (position, text) => {
    setTooltip({ show: true, position, text });
    // Automatically hide the tooltip after 3 seconds (3000 ms)
    setTimeout(() => {
      setTooltip({ show: false, position: {}, text: '' });
    }, 5000); // 5000ms = 5 seconds
  };
  
  const hideTooltipHandler = () => {
    setTooltip({ show: false, position: {}, text: '' });
  };

  return (
    // <div className="flex min-h-screen min-w-screen bg-white dark:bg-gray-900 text-black dark:text-white"  style={{ border: '2px solid black' }}>
    <div className="flex min-h-screen min-w-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      
      {/* Right Content */}
      {!isLoginPage && (
        <>
          <Sidebar isDark={isDark} setIsDark={setIsDark} collapsed={collapsed} 
            onShowTooltip={showTooltipHandler} 
            onHideTooltip={hideTooltipHandler} 
          />
           
           {/* Collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'absolute',
              top: '1rem',
              left: collapsed ? '64px' : '192px',
              transform: 'translateX(-50%)',
              zIndex: 10,
              width: '30px',
              height: '40px',
              backgroundColor: '#3B82F6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, left 0.2s ease',
            }}
            aria-label="Toggle Sidebar"
          >
            <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleLeft} style={{ fontSize: '0.75rem' }} />
          </button>
        </>
      )}

      {/* Left Upper Content */}
      <div className={`flex flex-col flex-1 ${isLoginPage ? 'h-screen' : 'p-4 h-screen'}`}>
        {!isLoginPage && (
          // <div className="flex justify-end items-center space-x-4 mb-6">
          <div className="flex justify-between items-center space-x-4 mb-6">
            {/* <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            <SettingsButton />
            <MessageButton />
            <NotificationButton />
            <AccountButton /> */}

            {/* LEFT SIDE: Dropdown */}
            <TopbarDropdown />

            {/* RIGHT SIDE: Icons */}
            <div className="flex items-center space-x-4">
              <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

              {/* Conditionally render LayoutButton only if superadmin and on the correct page */}
              {isSuperAdmin && isStrategicPlanPage && <LayoutButton />}

              <SettingsButton />
              <MessageButton />
              <NotificationButton />
              <AccountButton />
            </div>
            
          </div>
        )}

        {/* Left Lower Content */}
        <div className={`${isLoginPage ? '' : 'flex-grow overflow-auto'}`}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/review" element={<Review />} />
            <Route path="/one-page-strategic-plan" element={<OnePageStrategicPlan />} />
            <Route path="/flywheel" element={<Flywheel />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/growth-command-center" element={<GrowthCommandCenter />} />
            <Route path="/company-traction" element={<CompanyTraction />} />
            <Route path="/department-traction" element={<DepartmentTraction />} />
            <Route path="/who-what-when" element={<WhoWhatWhen />} />
            <Route path="/session-dates" element={<SessionDates />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/coaching-checklist" element={<CoachingChecklist />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/document-vault" element={<DocumentVault />} />
            <Route path="/members-departments" element={<MembersDepartments />} />
            <Route path="/members-directory" element={<MembersDirectory />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>

      {/* Tooltip - Rendered above everything else */}
      {tooltip.show && <Tooltip position={tooltip.position} text={tooltip.text} collapsed={collapsed} />}
      
    </div>
  );
}

function App() {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [collapsed, setCollapsed] = useState(false);

  const isLoginPage = location.pathname === '/';

  // Disable dark mode on login page regardless of user's setting
  const effectiveDarkMode = isLoginPage ? false : isDark;

  useEffect(() => {
    if (!isLoginPage) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, isLoginPage]);

  // force light mode on login page, this will set the state of the night mode icon
  useEffect(() => {
    if (isLoginPage) {
      setIsDark(false);
    }
  }, [isLoginPage]);

  return (
    <div className={effectiveDarkMode ? 'dark' : ''}>
      <Router>
        <Layout
          isDark={isDark}
          setIsDark={setIsDark}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </Router>
    </div>
  );
}

export default App;
