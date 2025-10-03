import React, { useState } from 'react';
import './AdminPanelSidebar.css';
import logo from '../../assets/images/webp/momentum-logo.webp';
import { 
  FaBars, FaChevronDown, FaChevronUp, 
  FaTachometerAlt, FaBullseye, FaLightbulb, FaCalendarAlt, 
  FaBuilding, FaUsers, FaUserShield, FaTable 
} from 'react-icons/fa';

const MENU_ITEMS = [
  { label: 'Dashboard', icon: <FaTachometerAlt /> },
  { label: 'Growth Goals', icon: <FaBullseye /> },
  { 
    label: 'Key Thrust Strategic Drivers',
    icon: <FaLightbulb />,
    children: [
      { label: 'Strategic Alignments', icon: <FaBullseye /> },
      { label: 'Annual Priorities', icon: <FaCalendarAlt /> },
      { label: 'Core Values', icon: <FaLightbulb /> },
      { label: 'Foundational Documents', icon: <FaBuilding /> },
      { label: 'Win Strategies', icon: <FaBullseye /> },
    ],
  },
  { 
    label: 'Meetings',
    icon: <FaCalendarAlt />,
    children: [
      { label: 'Monthly Meetings', icon: <FaCalendarAlt /> },
      { label: 'Quarterly Meetings', icon: <FaCalendarAlt /> },
    ],
  },
  { label: 'Companies', icon: <FaBuilding /> },
  { label: 'Users', icon: <FaUsers /> },
  { label: 'Roles', icon: <FaUserShield /> },
  { label: 'Table Headers', icon: <FaTable /> },
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
        <button onClick={onToggleSidebar} className="sidebar-toggle-btn">
          <FaBars size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="admin-menu">
        {MENU_ITEMS.map(renderMenuItem)}
      </nav>
    </aside>
  );
}
