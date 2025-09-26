// frontend\src\components\toast-notification\ToastNotification.js

import React, { useState, useEffect } from 'react';
import './ToastNotification.css';

const ToastNotification = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose(); // Close the toast after 4 seconds
      }, 4000); // Timeout duration

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast">
      <p>{message}</p>
    </div>
  );
};

export default ToastNotification;
