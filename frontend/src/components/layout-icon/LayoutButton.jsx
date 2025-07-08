// frontend\src\components\layout-icon\LayoutButton.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import Modal from './Modal';

const LayoutButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
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
