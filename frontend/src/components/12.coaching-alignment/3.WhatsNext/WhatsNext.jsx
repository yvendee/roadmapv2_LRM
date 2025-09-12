// frontend\src\components\12.coaching-alignment\3.WhatsNext\WhatsNext.jsx
import React, { useState, useEffect, useRef } from 'react';
import useWhatsNextStore from '../../../store/left-lower-content/12.coaching-alignment/3.whatsNextStore';
import { useHandleEditStore } from '../../../store/left-lower-content/12.coaching-alignment/0.handleEditStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './WhatsNext.css';

const WhatsNext = () => {
  const { whatsNextItems, setWhatsNextItems } = useWhatsNextStore();
  const { isEditing } = useHandleEditStore();
  const [editableItems, setEditableItems] = useState(whatsNextItems);
  const whatsNextContentRef = useRef(null);
  const organization = useLayoutSettingsStore.getState().organization;


  useEffect(() => {
    // Sync the editable items with the whatsNextItems from the store whenever they change
    setEditableItems(whatsNextItems);
  }, [whatsNextItems]);

  const handleInputChange = (index, event) => {
    const updatedItems = [...editableItems];
    updatedItems[index] = event.target.value;
    setEditableItems(updatedItems);
  };

  const updateCoachingWhatsNext = async (editableItems) => {
    // const encodedOrg = encodeURIComponent(organization);
  
    try {
      // Fetch CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      // Update request
      const res = await fetch(`${API_URL}/v1/coaching-alignment/whats-next/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization: organization,
          whatsNextItems: editableItems,
        }),
      });
  
      const json = await res.json();
  
      if (res.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ WhatsNext Items Updated:', json);
      } else {
        console.error('❌ Failed to update WhatsNext items:', json.message);
      }
    } catch (error) {
      console.error('❌ API Error:', error);
    }
  };
  

  const handleBlur = () => {
    // Save changes to the store when the user clicks outside
    setWhatsNextItems(editableItems);  // Update the store
    ENABLE_CONSOLE_LOGS && console.log('Updated WhatsNext Items:', editableItems);  // Log the updated data
    updateCoachingWhatsNext(editableItems);
  };

  const handleAddNewItem = () => {
    const newItem = '';  // New item starts empty
    const updatedItems = [...editableItems, newItem];
    setEditableItems(updatedItems);
    ENABLE_CONSOLE_LOGS && console.log('Newly Added WhatsNext Item:', newItem);  // Log the new added item
  };


  const deleteWhatsNextItem = async (itemToDelete) => {
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const res = await fetch(`${API_URL}/v1/coaching-alignment/whats-next/delete-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          itemToDelete,
        }),
      });
  
      const json = await res.json();
  
      if (res.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ Deleted WhatsNext item:', json);
        setEditableItems(json.whatsNextItems);     // Update local state
        setWhatsNextItems(json.whatsNextItems);    // Update store
      } else {
        console.error('❌ Failed to delete WhatsNext item:', json.message);
      }
    } catch (error) {
      console.error('❌ API Error during delete:', error);
    }
  };

  
  const handleDeleteItem = (index) => {
    const itemToDelete = editableItems[index];  // Get the item data
    ENABLE_CONSOLE_LOGS && console.log('Deleting item:', itemToDelete);  // Log the deleted item data

    const updatedItems = editableItems.filter((_, i) => i !== index);
    setEditableItems(updatedItems);
    // Update the store with the new list after deletion
    setWhatsNextItems(updatedItems);

    // Call backend delete
    deleteWhatsNextItem(itemToDelete);
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
