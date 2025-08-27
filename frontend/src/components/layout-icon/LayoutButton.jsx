// frontend\src\components\layout-icon\LayoutButton.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import Modal from './Modal';

const LayoutButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = async () => {
    setIsModalOpen(false);

    // 🔍 Get the current store values
    const currentToggles = useLayoutSettingsStore.getState().toggles;
    const organization = useLayoutSettingsStore.getState().organization;
    const uniqueId = useLayoutSettingsStore.getState().unique_id;

    // 🧾 Log the store state
    ENABLE_CONSOLE_LOGS && console.log('Modal closed — LayoutSettingsStore values:');
    ENABLE_CONSOLE_LOGS && console.log('Toggles:', currentToggles);
    ENABLE_CONSOLE_LOGS && console.log('Organization:', organization);
    ENABLE_CONSOLE_LOGS && console.log('Unique ID:', uniqueId);

    
    // 🚀 Push update to the database
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
    
      const response = await fetch(`${API_URL}/v1/update-layout-toggles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          toggles: currentToggles,
        }),
      });
    
      const data = await response.json();
      ENABLE_CONSOLE_LOGS && console.log('Update response:', data);
    
      if (!response.ok) {
        console.error('Update failed:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Update request error:', error);
    }

  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <button
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        aria-label="Layout"
        onClick={handleModalOpen}
      >
        <FontAwesomeIcon icon={faThLarge} size="1x" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default LayoutButton;
