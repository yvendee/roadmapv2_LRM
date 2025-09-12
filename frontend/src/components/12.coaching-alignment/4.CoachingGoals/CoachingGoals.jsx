// frontend\src\components\12.coaching-alignment\4.CoachingGoals\CoachingGoals.jsx
import React, { useState, useEffect, useRef } from 'react';
import useCoachingGoalsStore from '../../../store/left-lower-content/12.coaching-alignment/4.coachingGoalsStore';
import { useHandleEditStore } from '../../../store/left-lower-content/12.coaching-alignment/0.handleEditStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './CoachingGoals.css';

const CoachingGoals = () => {
  const { coachingGoalsItems, setCoachingGoalsItems } = useCoachingGoalsStore();
  const { isEditing } = useHandleEditStore();
  const [editableItems, setEditableItems] = useState(coachingGoalsItems);
  const coachingGoalsContentRef = useRef(null);
  const organization = useLayoutSettingsStore.getState().organization;

  useEffect(() => {
    // Sync the editable items with the coachingGoalsItems from the store whenever they change
    setEditableItems(coachingGoalsItems);
  }, [coachingGoalsItems]);


  const updateCoachingGoalsItems = async (editableItems) => {
    // const encodedOrg = encodeURIComponent(organization);
  
    try {
      // ✅ Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const res = await fetch(`${API_URL}/v1/coaching-alignment/coaching-goals/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          coachingGoalsItems: editableItems,
        }),
      });
  
      const json = await res.json();
  
      if (res.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ Coaching Goals Updated:', json);
      } else {
        console.error('❌ Failed to update coaching goals:', json.message);
      }
    } catch (error) {
      console.error('❌ API Error:', error);
    }
  };

  const deleteCoachingGoalItem = async (itemToDelete) => {
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const res = await fetch(`${API_URL}/v1/coaching-alignment/coaching-goals/delete-item`, {
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
        ENABLE_CONSOLE_LOGS && console.log('✅ Item deleted successfully:', json.message);
      } else {
        console.error('❌ Delete failed:', json.message);
      }
    } catch (err) {
      console.error('❌ API error:', err.message);
    }
  };
  
  
  const handleInputChange = (index, event) => {
    const updatedItems = [...editableItems];
    updatedItems[index] = event.target.value;
    setEditableItems(updatedItems);
  };

  const handleBlur = () => {
    // Save changes to the store when the user clicks outside
    setCoachingGoalsItems(editableItems);  // Update the store
    ENABLE_CONSOLE_LOGS && console.log('Updated Coaching Goals Items:', editableItems);  // Log the updated data
    updateCoachingGoalsItems(editableItems);
  };

  const handleAddNewItem = () => {
    const newItem = '';  // New item starts empty
    const updatedItems = [...editableItems, newItem];
    setEditableItems(updatedItems);
    ENABLE_CONSOLE_LOGS && console.log('Newly Added Coaching Goal Item:', newItem);  // Log the new added item
  };

  const handleDeleteItem = (index) => {
    const itemToDelete = editableItems[index];  // Get the item data
    ENABLE_CONSOLE_LOGS && console.log('Deleting item:', itemToDelete);  // Log the deleted item data

    const updatedItems = editableItems.filter((_, i) => i !== index);
    setEditableItems(updatedItems);
    // Update the store with the new list after deletion
    setCoachingGoalsItems(updatedItems);

    // 🔁 Call the API to sync deletion
    deleteCoachingGoalItem(itemToDelete);
  };

  return (
    <div className="coaching-goals-card">
      <div className="coaching-goals-header">
        <h4>Coaching Goals Check / Update</h4>
        <p>List the 4 coaching goals you and the client are working toward:</p>
        
      </div>

      <div
        className="coaching-goals-content"
        ref={coachingGoalsContentRef}
        onClick={() => isEditing && coachingGoalsContentRef.current.focus()}
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
                    className="coaching-goals-textarea"
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

export default CoachingGoals;
