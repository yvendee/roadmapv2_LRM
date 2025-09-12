import React, { useState, useEffect, useRef } from 'react';
import useCurrentFocusStore from '../../../store/left-lower-content/12.coaching-alignment/1.currentFocusStore';
import { useHandleEditStore } from '../../../store/left-lower-content/12.coaching-alignment/0.handleEditStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import delete icon
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './CurrentFocus.css';

const CurrentFocus = () => {

  const { focusItems, setFocusItems } = useCurrentFocusStore();
  const { isEditing } = useHandleEditStore();
  const [editableItems, setEditableItems] = useState(focusItems);
  const focusContentRef = useRef(null);
  const organization = useLayoutSettingsStore.getState().organization;

  const updateCoachingFocusItems = async (editableItems) => {
    const encodedOrg = encodeURIComponent(organization);
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const res = await fetch(`${API_URL}/v1/coaching-alignment/current-focus/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization: organization,
          focusItems: editableItems,
        }),
      });
  
      const json = await res.json();
  
      if (res.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ Focus Items Updated:', json);
      } else {
        console.error('❌ Failed to update focus items:', json.message);
      }
    } catch (error) {
      console.error('❌ API Error:', error);
    }
  };


  const handleBlur = () => {
    // Log the content when the user clicks outside the textarea
    ENABLE_CONSOLE_LOGS && console.log('Updated Focus Items:', editableItems);
    setFocusItems(editableItems);  // Update the store with the new data
    updateCoachingFocusItems(editableItems);
  };

  const handleInputChange = (index, event) => {
    const updatedItems = [...editableItems];
    updatedItems[index] = event.target.value;
    setEditableItems(updatedItems);
  };

  const handleAddNewLine = () => {
    setEditableItems([...editableItems, '']);
  };

  const deleteFocusItem = async (itemToDelete) => {
    const organization = useLayoutSettingsStore.getState().organization;
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const res = await fetch(`${API_URL}/v1/coaching-alignment/current-focus/delete-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization: organization,
          item: itemToDelete,
        }),
      });
  
      const json = await res.json();
  
      if (res.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ Deleted from DB:', json.message);
      } else {
        console.error('❌ Failed to delete from DB:', json.message);
      }
    } catch (error) {
      console.error('❌ API Error:', error);
    }
  };


  const handleDeleteItem = (index) => {
    const updatedItems = editableItems.filter((_, i) => i !== index);
    setEditableItems(updatedItems);
    // Update the store with the new list after deletion
    setFocusItems(updatedItems);
    ENABLE_CONSOLE_LOGS && console.log(`Deleted Item at index ${index}`);
    const itemToDelete = editableItems[index]; // Get the item data
    ENABLE_CONSOLE_LOGS && console.log('Deleting item:', itemToDelete); // Log the deleted item data
    deleteFocusItem(itemToDelete); // 🔥 Call the backend delete API
  };
  
  useEffect(() => {
    // Sync the editable items when the store content changes
    setEditableItems(focusItems);
  }, [focusItems]);

  return (
    <div className="current-focus-card">
      <div className="current-focus-header">
        <h4>Current Focus</h4>
        <p>What are the 1-2 most important things we're focused on right now?</p>
      </div>
      <div
        className="current-focus-content"
        ref={focusContentRef}
        onClick={() => isEditing && focusContentRef.current.focus()}
      >
        {isEditing ? (
          <div>
            <ul>
              {editableItems.map((item, index) => (
                <li key={index} className="focus-item">
                  <textarea
                    value={item}
                    onChange={(e) => handleInputChange(index, e)}
                    onBlur={handleBlur}
                    rows="3"
                    className="focus-item-textarea"
                  />
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="delete-button"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="btn btn-secondary btn-sm mt-2"
              onClick={handleAddNewLine}
            >
              Add New Line
            </button>
          </div>
        ) : (
          <ul>
            {editableItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CurrentFocus;
