import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ text: '', type: '' });
  const [resetCodeMessage, setResetCodeMessage] = useState({ text: '', type: '' }); // type: "success" | "error"


  const navigate = useNavigate();

  const handleRequestCode = (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email.');
    console.log('Request Reset Code clicked for email:', email);
    setShowResetModal(true);
  };

  const handleSendResetCode = (e) => {
    e.preventDefault();
    console.log('Send Reset Code clicked');
  
    if (resetCode === '1234') {
      setShowResetModal(false);
      setShowNewPasswordModal(true);
      setResetCodeMessage({ text: '', type: '' }); // Clear any message
    } else {
      setResetCodeMessage({ text: 'Invalid reset code. Please try again.', type: 'error' });
    }
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    // Simulate an API call with hardcoded success
    try {
      if (!newPassword || newPassword.length < 4) {
        throw new Error('Weak password');
      }

      // Simulate success
      setFeedbackMessage({ text: 'Password has been reset successfully', type: 'success' });
    } catch (error) {
      setFeedbackMessage({ text: 'Something went wrong', type: 'error' });
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="forgot-password-title">Forgot Password</h2>
        <form onSubmit={handleRequestCode}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="forgot-password-input"
            placeholder="you@example.com"
          />

          <button type="submit" className="forgot-password-button mt-4">
            Request Reset Code
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="back-to-login-button mt-2"
          >
            Back to Login
          </button>
        </form>
      </div>

      {/* 🔐 Reset Code Modal */}
      {showResetModal && (
        <div className="reset-modal-overlay" onClick={() => setShowResetModal(false)}>
            <div className="reset-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Enter Reset Code</h3>
            <form onSubmit={handleSendResetCode}>
                <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                className="forgot-password-input"
                placeholder="Enter the reset code"
                />
                <button type="submit" className="forgot-password-button mt-4">
                Send Reset Code
                </button>

                {/* ✅ Message below the button */}
                {resetCodeMessage.text && (
                <p
                    className={`reset-code-message ${
                    resetCodeMessage.type === 'error' ? 'error-text' : 'success-text'
                    }`}
                >
                    {resetCodeMessage.text}
                </p>
                )}
            </form>
            </div>
        </div>
      )}


      {/* 🔒 New Password Modal */}
      {showNewPasswordModal && (
        <div
            className="new-password-modal-overlay"
            onClick={() => {
            setShowNewPasswordModal(false);
            setFeedbackMessage({ text: '', type: '' }); // ✅ Reset feedback message
            }}
        >
            <div className="new-password-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Set New Password</h3>
            <form onSubmit={handleChangePassword}>
                <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="forgot-password-input"
                placeholder="Enter new password"
                />
                <button type="submit" className="forgot-password-button mt-4">
                Change Password
                </button>

                {/* ✅ Feedback message */}
                {feedbackMessage.text && (
                <p className={`feedback-message ${feedbackMessage.type}`}>
                    {feedbackMessage.text}
                </p>
                )}
            </form>
            </div>
        </div>
      )}

    </div>
  );
}

export default ForgotPassword;
