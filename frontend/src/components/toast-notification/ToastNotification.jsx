// frontend\src\components\toast-notification\ToastNotification.js

import React, { useEffect } from 'react';
import './ToastNotification.css';

const ToastNotification = ({ message, isVisible, onClose, status }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose(); // Close the toast after 4 seconds
      }, 4000); // Timeout duration

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Determine background color based on status
  const backgroundColor = status === 'success' ? '#5cb85c' : '#d9534f';  // Green for success, Red for error

  return (
    <div className="unique-toast" style={{ backgroundColor }}>
      <p>{message}</p>
    </div>
  );
};

export default ToastNotification;
