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
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <AdminPanelSidebar
        sidebarOpen={sidebarOpen}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

      <div className="flex flex-col flex-1 ml-0 md:ml-64">
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
