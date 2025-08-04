// frontend\src\components\12.coaching-alignment\3.WhatsNext\WhatsNext.jsx
import React, { useState, useEffect, useRef } from 'react';
import useWhatsNextStore from '../../../store/left-lower-content/12.coaching-alignment/3.whatsNextStore';
import { useHandleEditStore } from '../../../store/left-lower-content/12.coaching-alignment/0.handleEditStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './WhatsNext.css';

const WhatsNext = () => {
  const { whatsNextItems, setWhatsNextItems } = useWhatsNextStore();
  const { isEditing } = useHandleEditStore();
  const [editableItems, setEditableItems] = useState(whatsNextItems);
  const whatsNextContentRef = useRef(null);

  useEffect(() => {
    // Sync the editable items with the whatsNextItems from the store whenever they change
    setEditableItems(whatsNextItems);
  }, [whatsNextItems]);

  const handleInputChange = (index, event) => {
    const updatedItems = [...editableItems];
    updatedItems[index] = event.target.value;
    setEditableItems(updatedItems);
  };

  const handleBlur = () => {
    // Save changes to the store when the user clicks outside
    setWhatsNextItems(editableItems);  // Update the store
    ENABLE_CONSOLE_LOGS && console.log('Updated WhatsNext Items:', editableItems);  // Log the updated data
  };

  const handleAddNewItem = () => {
    const newItem = '';  // New item starts empty
    const updatedItems = [...editableItems, newItem];
    setEditableItems(updatedItems);
    ENABLE_CONSOLE_LOGS && console.log('Newly Added WhatsNext Item:', newItem);  // Log the new added item
  };

  const handleDeleteItem = (index) => {
    const itemToDelete = editableItems[index];  // Get the item data
    ENABLE_CONSOLE_LOGS && console.log('Deleting item:', itemToDelete);  // Log the deleted item data

    const updatedItems = editableItems.filter((_, i) => i !== index);
    setEditableItems(updatedItems);
    // Update the store with the new list after deletion
    setWhatsNextItems(updatedItems);
  };

  return (
    <div className="whats-next-card">
      <div className="whats-next-header">
        <h4>What's Next + Other Considerations</h4>
        <p>Key actions, accountabilities, reflections, or support areas before the next session:</p>
      </div>

      <div
        className="whats-next-content"
        ref={whatsNextContentRef}
        onClick={() => isEditing && whatsNextContentRef.current.focus()}
      >
        {isEditing ? (
          <div>
            <ul>
              {editableItems.map((item, index) => (
                <li key={index}>
                  <textarea
                    value={item}
                    onChange={(e) => handleInputChange(index, e)}
                    onBlur={handleBlur}
                    rows="3"
                    className="whats-next-textarea"
                  />
                  {/* Delete button with FontAwesome trash icon */}
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="delete-button"
                    aria-label="Delete Item"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="btn btn-secondary btn-sm mt-2"
              onClick={handleAddNewItem}
            >
              Add New Line
            </button>
          </div>
        ) : (
          <ul>
            {editableItems.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>
          
        )}


      </div>
    </div>
  );
};

export default WhatsNext;
