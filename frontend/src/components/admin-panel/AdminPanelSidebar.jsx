import React, { useState } from 'react';
import './AdminPanelSidebar.css';
import logo from '../../assets/images/webp/momentum-logo.webp';
import PanelLeftIcon from '../../assets/images/svg/PanelLeftIcon';
import { 
  FaBars, FaChevronDown, FaChevronUp, 
  FaTachometerAlt, FaBullseye, FaLightbulb, FaCalendarAlt, 
  FaBuilding, FaUsers, FaUserShield, FaTable, FaKey, FaWrench, FaStar, FaChartLine, FaTools  
} from 'react-icons/fa';

const MENU_ITEMS = [
  { label: 'Dashboard', icon: <FaTachometerAlt /> },
  { label: 'Growth Goals', icon: <FaBullseye /> },
  { 
    label: 'OPSP',
    icon: <FaLightbulb />,
    children: [
      { label: 'Key Thrust Strategic Drivers', icon: <FaKey /> },
      { label: 'Strategic Alignments', icon: <FaLightbulb />, },
      { label: 'Annual Priorities', icon: <FaCalendarAlt /> },
    ],
  },
  { 
    label: 'Tools',
    icon: <FaWrench />,
    children: [
      { label: 'Core Values', icon: <FaStar /> },
      { label: 'Foundational Documents', icon: <FaBuilding /> },
      { label: 'Win Strategies', icon: <FaChartLine  /> },
    ],
  },
  { 
    label: 'Session Dates',
    icon: <FaCalendarAlt />,
    children: [
      { label: 'Monthly Meetings', icon: <FaCalendarAlt /> },
      { label: 'Quarterly Meetings', icon: <FaCalendarAlt /> },
    ],
  },
  { 
    label: 'Maintenance',
    icon: <FaTools />,
    children: [
      { label: 'Companies', icon: <FaBuilding /> },
      { label: 'Users', icon: <FaUsers /> },
      { label: 'Roles', icon: <FaUserShield /> },
      { label: 'Table Headers', icon: <FaTable /> },
    ],
  },
];

export default function AdminPanelSidebar({
  sidebarOpen,
  selectedItem,
  setSelectedItem,
  onToggleSidebar,
}) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderMenuItem = (item) => {
    if (item.children) {
      const isExpanded = expandedItems[item.label];

      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpand(item.label)}
            className={`admin-menu-item flex justify-between items-center ${selectedItem === item.label ? 'active' : ''}`}
          >
            <span className="flex items-center gap-2">
              {item.icon}
              {item.label}
            </span>
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {isExpanded && (
            <div className="admin-submenu pl-6">
              {item.children.map(subItem => (
                <button
                  key={subItem.label}
                  onClick={() => setSelectedItem(subItem.label)}
                  className={`admin-menu-item sub-item ${selectedItem === subItem.label ? 'active' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    {subItem.icon}
                    {subItem.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.label}
        onClick={() => setSelectedItem(item.label)}
        className={`admin-menu-item flex items-center gap-2 ${selectedItem === item.label ? 'active' : ''}`}
      >
        {item.icon}
        {item.label}
      </button>
    );
  };

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="admin-sidebar-header">
        <img src={logo} alt="Momentum Logo" className="admin-logo" />
        <button onClick={onToggleSidebar} className="sidebar-toggle-btn" aria-label="Toggle Sidebar">
          <PanelLeftIcon />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="admin-menu">
        {MENU_ITEMS.map(renderMenuItem)}
      </nav>
    </aside>
  );
}
