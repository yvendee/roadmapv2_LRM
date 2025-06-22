// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Home from './components/home/Home';
import Review from './components/review/Review';
import Chat from './components/chat/Chat';
import ThemeToggle from './components/theme/ThemeToggle'; // adjust path if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCog, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import './index.css';

function App() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <Router>
        <div className="flex min-h-screen min-w-screen bg-white dark:bg-gray-900 text-black dark:text-white">

          {/* Sidebar - fixed width, full height */}
          <Sidebar isDark={isDark} setIsDark={setIsDark} collapsed={collapsed} />
          
          {/* Collapse Button - absolutely positioned */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'absolute',
              top: '1rem',
              left: collapsed ? '64px' : '192px', // exact pixel position at the sidebar edge
              transform: 'translateX(-50%)',      // centers the button over the edge
              zIndex: 10,
              width: '30px',
              height: '40px',
              backgroundColor: '#3B82F6', // blue
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
            <FontAwesomeIcon
              icon={collapsed ? faAngleRight : faAngleLeft}
              style={{
                fontSize: '0.75rem',
                color: 'white',
              }}
            />
          </button>

          {/* Right side - full height, vertical split */}
          {/* <div className="flex flex-col flex-1 p-4 h-screen" style={{ border: '1px solid black' }}> */}
          <div className="flex flex-col flex-1 p-4 h-screen">
            {/* Upper portion: Account icon, settings, theme toggle */}
            {/* <div className="flex justify-end items-center space-x-4 mb-6" style={{ border: '1px solid black' }}> */}
            <div className="flex justify-end items-center space-x-4 mb-6">
              <button
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Account"
              >
                <FontAwesomeIcon icon={faUserCircle} size="1x" />
              </button>
              <button
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Settings"
              >
                <FontAwesomeIcon icon={faCog} size="1x" />
              </button>
              <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            </div>

            {/* Lower portion: Routed page content, scrollable */}
            <div className="flex-grow overflow-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/review" element={<Review />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
