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
import WhoWhatWhen from './components/who-what-when/who-What-When';
import Chat from './components/chat/Chat';
import ThemeToggle from './components/theme/ThemeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCog, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './index.css';

function Layout({ isDark, setIsDark, collapsed, setCollapsed }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

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
            <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" aria-label="Account">
              <FontAwesomeIcon icon={faUserCircle} size="1x" />
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" aria-label="Settings">
              <FontAwesomeIcon icon={faCog} size="1x" />
            </button>
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
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

  // useEffect(() => {
  //   localStorage.setItem('theme', isDark ? 'dark' : 'light');
  // }, [isDark]);

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
