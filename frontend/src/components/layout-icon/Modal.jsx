import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './Modal.css'; // Import the updated CSS

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // ✅ Get Zustand store state
  const toggles = useLayoutSettingsStore((state) => state.toggles);
  const setToggle = useLayoutSettingsStore((state) => state.setToggle);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleOverlayClick}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Layout Settings</h2>
          <button onClick={onClose} className="close-btn">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="space-y-4">
          {Object.keys(toggles).map((key) => (
            <label key={key} className="flex items-center justify-between py-2 text-black">
              {key}
              <label className="switch">
                <input
                  type="checkbox"
                  checked={toggles[key]}
                  onChange={(e) => setToggle(key, e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
