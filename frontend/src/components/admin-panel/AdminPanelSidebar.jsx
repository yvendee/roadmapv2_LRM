import React from 'react';
import './AdminPanelSidebar.css'; // <-- Import the CSS file
import logo from '../../assets/images/webp/momentum-logo.webp';
import { FaBars } from 'react-icons/fa';

const MENU_ITEMS = [
  'Dashboard',
  'Growth Goals',
  'Key Thrust Strategic Drivers',
  'Strategic Alignments',
  'Annual Priorities',
  'Core Values',
  'Foundational Documents',
  'Win Strategies',
  'Monthly Meetings',
  'Quarterly Meetings',
  'Companies',
  'Users',
  'Roles',
  'Table Headers',
];

export default function AdminPanelSidebar({
  sidebarOpen,
  selectedItem,
  setSelectedItem,
  onToggleSidebar,
}) {
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
        {MENU_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => setSelectedItem(item)}
            className={`admin-menu-item ${selectedItem === item ? 'active' : ''}`}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
