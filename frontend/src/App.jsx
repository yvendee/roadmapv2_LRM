// frontend\src\App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Sidebar from './components/sidebar/Sidebar';
import Home from './components/home/Home';
import Review from './components/review/Review';
import OnePageStrategicPlan from './components/one-page-strategic-plan/onePageStrategicPlan';
import Flywheel from './components/flywheel/Flywheel';
import Scoreboard from './components/scoreboard/Scoreboard';
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
import ThemeToggle from './components/theme-icon/ThemeToggle';
import SettingsButton from './components/settings-icon/SettingsButton';
import AccountButton from './components/account-icon/AccountButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import useSessionKeepAlive from './hooks/KeepAlive';
import './index.css';

function Layout({ isDark, setIsDark, collapsed, setCollapsed }) {

  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  useSessionKeepAlive();

  // 👇 Force light mode on login page
  useEffect(() => {
    if (isLoginPage) {
      setIsDark(false);
    } else {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }, [isLoginPage, isDark]);

  return (
    // <div className="flex min-h-screen min-w-screen bg-white dark:bg-gray-900 text-black dark:text-white"  style={{ border: '2px solid black' }}>
    <div className="flex min-h-screen min-w-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      {!isLoginPage && (
        <>
          <Sidebar isDark={isDark} setIsDark={setIsDark} collapsed={collapsed} />
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

      <div className={`flex flex-col flex-1 ${isLoginPage ? 'h-screen' : 'p-4 h-screen'}`}>
        {!isLoginPage && (
          <div className="flex justify-end items-center space-x-4 mb-6">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            <SettingsButton />
            <AccountButton />
          </div>
        )}

        <div className={`${isLoginPage ? '' : 'flex-grow overflow-auto'}`}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/review" element={<Review />} />
            <Route path="/one-page-strategic-plan" element={<OnePageStrategicPlan />} />
            <Route path="/flywheel" element={<Flywheel />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
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
