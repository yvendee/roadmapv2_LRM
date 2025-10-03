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
      setSidebarOpen(!mobile); // auto-hide on mobile, show on desktop
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // run on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleMenuSelect = (item) => {
    setSelectedItem(item);

    // Auto-close sidebar on mobile when selecting a menu item
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <AdminPanelSidebar
        sidebarOpen={sidebarOpen}
        selectedItem={selectedItem}
        setSelectedItem={handleMenuSelect}
        onToggleSidebar={toggleSidebar} // pass for mobile button
      />

      <div className={`flex flex-col flex-1 transition-all duration-300 ml-0 ${!isMobile ? 'md:ml-64' : ''}`}>
        <AdminPanelHeader
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <AdminPanelContent selectedItem={selectedItem} />
      </div>
    </div>
  );
}
