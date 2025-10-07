// frontend/src/components/admin-panel/pages/Dashboard/Dashboard.jsx

import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../../../../store/loginStore';
import './Dashboard.css';
import API_URL from '../../../../configs/config';

export default function DashboardWidget() {
  const navigate = useNavigate();
  const user = useLoginStore((state) => state.user);

  const getInitials = (fullname) => {
    if (!fullname) return '??';
    const [first = '', last = ''] = fullname.trim().split(' ');
    return `${first[0] || ''}${last[0] || ''}`.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        navigate('/', { state: { loginError: 'You have successfully logged out' } });
      } else {
        alert('Logout failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Logout error: ' + error.message);
    }
  };

  return (
    <div className="dash-widget-container">
      <h1 className="dash-widget-title">Dashboard</h1>

      <div className="dash-widget-card">
        <div className="dash-widget-profile">
          <div className="dash-widget-avatar">{getInitials(user?.fullname)}</div>
          <div>
            <div className="dash-widget-welcome">Welcome</div>
            <div className="dash-widget-name">{user?.fullname}</div>
          </div>
        </div>

        <button className="dash-widget-signout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="dash-widget-signout-icon" />
          Sign out
        </button>
      </div>
    </div>
  );
}
