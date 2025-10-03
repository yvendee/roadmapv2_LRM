import React, { useState } from 'react';
import './AdminPanelSidebar.css';
import logo from '../../assets/images/webp/momentum-logo.webp';
import { FaBars, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MENU_ITEMS = [
  { label: 'Dashboard' },
  { label: 'Growth Goals' },
  { 
    label: 'Key Thrust Strategic Drivers',
    children: [
      'Strategic Alignments',
      'Annual Priorities',
      'Core Values',
      'Foundational Documents',
      'Win Strategies',
    ],
  },
  { 
    label: 'Meetings',
    children: [
      'Monthly Meetings',
      'Quarterly Meetings',
    ],
  },
  { label: 'Companies' },
  { label: 'Users' },
  { label: 'Roles' },
  { label: 'Table Headers' },
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
            <span>{item.label}</span>
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {isExpanded && (
            <div className="admin-submenu pl-6">
              {item.children.map(subItem => (
                <button
                  key={subItem}
                  onClick={() => setSelectedItem(subItem)}
                  className={`admin-menu-item sub-item ${selectedItem === subItem ? 'active' : ''}`}
                >
                  {subItem}
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
        className={`admin-menu-item ${selectedItem === item.label ? 'active' : ''}`}
      >
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
