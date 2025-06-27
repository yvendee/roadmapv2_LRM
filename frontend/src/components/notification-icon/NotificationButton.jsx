// frontend/src/components/notification-icon/NotificationButton.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const NotificationButton = ({ hasNotifications = false, onClick }) => {
  return (
    <button
      className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      aria-label="Notifications"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faBell} size="1x" />
      {hasNotifications && (
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-gray-800" />
      )}
    </button>
  );
};

export default NotificationButton;
