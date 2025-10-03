// frontend/src/components/admin-panel/AdminPanel.jsx

import React, { useState, useEffect } from 'react';
import AdminPanelHeader from './AdminPanelHeader';
import AdminPanelSidebar from './AdminPanelSidebar';
import AdminPanelContent from './AdminPanelContent';

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const handleMenuSelect = (item) => {
    setSelectedItem(item);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-gray-900 text-black dark:text-white overflow-hidden">
      <AdminPanelSidebar
        sidebarOpen={sidebarOpen}
        selectedItem={selectedItem}
        setSelectedItem={handleMenuSelect}
        onToggleSidebar={toggleSidebar}
      />

      <div className={`flex flex-col flex-1 min-h-full overflow-hidden ${!isMobile ? 'md:ml-64' : ''}`}>
        <AdminPanelHeader
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex-1 overflow-auto">
          <AdminPanelContent selectedItem={selectedItem} />
        </div>
      </div>
    </div>
  );
}
