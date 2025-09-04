// frontend\src\pages\create-user\Toast.jsx
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        zIndex: 9999,
        minWidth: '220px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        userSelect: 'none',
      }}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Toast;
