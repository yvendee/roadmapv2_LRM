import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import useNotificationStore from '../../store/notificationStore'; 

const NotificationButton = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = useNotificationStore((state) => state.notifications);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  // const toggleDropdown = () => {
  //   setOpen(prev => !prev);
  //   if (!open) markAllAsRead(); // ✅ mark all as read
  // };

  const toggleDropdown = () => {
    setOpen(prev => !prev);
    if (!open) {
      if (notifications.some(n => n.notification_status === "unread")) {
        useNotificationStore.setState((state) => {
          const updatedNotifications = state.notifications.map(n => ({
            ...n,
            notification_status: "read"
          }));
          console.log('Updated notifications:', updatedNotifications);
          return { notifications: updatedNotifications };
        });
      }
    }
  };
  
  

  const hasUnread = notifications.some(n => n.notification_status === "unread");

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const highlightMentions = (text) => {
    // This regex finds @mentions: words starting with @ and containing letters, numbers, underscores, dots, or hyphens
    const mentionRegex = /@[\w.-]+/g;
  
    return text.replace(mentionRegex, (match) => {
      return `<span class="text-blue-600 dark:text-blue-400 font-semibold">${match}</span>`;
    });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        aria-label="Notifications"
        onClick={toggleDropdown}
      >
        <FontAwesomeIcon icon={faBell} size="1x" />
        {hasUnread && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-gray-800" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
          <ul className="p-2 space-y-2 max-h-60 overflow-y-auto text-sm text-gray-700 dark:text-gray-300">
            {notifications.map((notif, idx) => (
              <li
                key={idx}
                className={`px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  notif.notification_status === "unread" ? 'font-semibold' : ''
                }`}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightMentions(notif.message),
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
