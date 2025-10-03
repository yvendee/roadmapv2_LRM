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
    <div className="flex w-screen h-screen overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* Sidebar (z-10 so it layers properly in mobile) */}
      <AdminPanelSidebar
        sidebarOpen={sidebarOpen}
        selectedItem={selectedItem}
        setSelectedItem={handleMenuSelect}
        onToggleSidebar={toggleSidebar}
      />

      {/* Right Side: Header + Content */}
      <div className="flex flex-col flex-1 h-screen">
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
