// frontend/src/components/account-icon/AccountButton.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../configs/config';
// import useUserStore from '../../store/userStore';
import useLoginStore from '../../store/loginStore';
import './AccountButton.css';


const AccountButton = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 
  const user = useLoginStore((state) => state.user);
  // const user = useUserStore((state) => state.user);

  const [showModal, setShowModal] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', message: '' });

  // const HARDCODED_OLD_PASSWORD = 'admin123';

  // const handleChangePassword = () => {
  //   if (oldPasswordInput === HARDCODED_OLD_PASSWORD && newPasswordInput.trim()) {
  //     setFeedbackMsg({ type: 'success', message: 'Password has been changed' });
  //     console.log('Password changed:', { oldPasswordInput, newPasswordInput });
  //   } else {
  //     setFeedbackMsg({ type: 'error', message: 'Old password is wrong' });
  //   }
  // };

  const handleChangePassword = async () => {
    if (!oldPasswordInput.trim() || !newPasswordInput.trim()) {
      setFeedbackMsg({ type: 'error', message: 'Please fill both fields' });
      return;
    }
  
    try {
      // 1. Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      // 2. Send POST request to change password
      const response = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          oldPassword: oldPasswordInput,
          newPassword: newPasswordInput,
          email: user.email,             // from loginStore
          organization: user.organization, // from loginStore
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setFeedbackMsg({ type: 'error', message: result.message || 'Error changing password' });
        return;
      }
  
      setFeedbackMsg({ type: 'success', message: result.message });
      setOldPasswordInput('');
      setNewPasswordInput('');
    } catch (err) {
      console.error('❌ Change password request error:', err);
      setFeedbackMsg({ type: 'error', message: 'Network error' });
    }
  };
  
  
  
  const handleCloseModal = () => {
    setShowModal(false);
    setOldPasswordInput('');
    setNewPasswordInput('');
    setFeedbackMsg({ type: '', message: '' });
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Logout failed');

      const data = await response.json();
      if (data.status === 'success') {
        // navigate('/'); 
        navigate('/', { state: {loginError: 'You have successfully logged out'} });
      } else {
        alert('Logout failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Logout error: ' + error.message);
    }
  };
  

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        aria-label="Account"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faUserCircle} size="1x" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <div className="px-4 py-2 text-sm text-gray-900 dark:text-white font-semibold">
            {/* {user?.fullname ?? 'Unknown User'} {user?.role && `(as ${user.role})`} */}
            {/* {user?.fullname ?? 'Unknown User'} {user?.position && `(as ${user.position})`} */}
            {user?.fullname ?? 'Unknown User'} {user?.role && `(as ${user.role})`}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 my-1" />

          <div
            className="dropdown-item"
            onClick={() => setShowModal(true)}
          >
            Change Password
          </div>

          {user?.role === 'superadmin' && (
            <div
              className="dropdown-item"
              onClick={() => {
                setOpen(false);
                navigate('/create-user');
              }}
            >
              Create User
            </div>
          )}

          {user?.role === 'superadmin' && (
            <div
              className="dropdown-item"
              onClick={() => {
                setOpen(false);
                navigate('/create-organization');
              }}
            >
              Create Organization
            </div>
          )}
          <div
            className="custom-logout-item"
            onClick={handleLogout}
          >
            Logout
          </div>

        </div>
        
      )}

      {showModal && (
        <div className="account-modal-overlay" onClick={handleCloseModal}>
          <div className="account-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="account-modal-title">Change Password</h2>
            <input
              type="password"
              placeholder="Old Password"
              className="account-modal-input"
              value={oldPasswordInput}
              onChange={(e) => setOldPasswordInput(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="account-modal-input"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
            />
            <div className="account-modal-buttons">
              <button className="account-modal-button" onClick={handleChangePassword}>
                Change
              </button>
              <button className="account-modal-button" onClick={handleCloseModal}>
                Close
              </button>
            </div>
            {feedbackMsg.message && (
              <div
                className={`account-modal-feedback ${
                  feedbackMsg.type === 'success' ? 'success' : 'error'
                }`}
              >
                {feedbackMsg.message}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountButton;
