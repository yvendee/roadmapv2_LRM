import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const SettingsButton = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleClick = () => {
    // navigate('/');  // Navigate to the home page ("/")
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleClick} // Trigger navigate on click
      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      aria-label="Settings"
    >
      <FontAwesomeIcon icon={faCog} size="1x" />
    </button>
  );
};

export default SettingsButton;



// // frontend/src/components/settings-icon/SettingsButton.jsx
// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCog } from '@fortawesome/free-solid-svg-icons';

// const SettingsButton = () => {
//   return (
//     <button
//       className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
//       aria-label="Settings"
//     >
//       <FontAwesomeIcon icon={faCog} size="1x" />
//     </button>
//   );
// };

// export default SettingsButton;
