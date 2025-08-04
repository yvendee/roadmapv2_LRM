// frontend\src\components\12.coaching-alignment\4.CoachingGoals\CoachingGoals.jsx
import React, { useState, useEffect, useRef } from 'react';
import useCoachingGoalsStore from '../../../store/left-lower-content/12.coaching-alignment/4.coachingGoalsStore';
import { useHandleEditStore } from '../../../store/left-lower-content/12.coaching-alignment/0.handleEditStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './CoachingGoals.css';

const CoachingGoals = () => {
  const { coachingGoalsItems, setCoachingGoalsItems } = useCoachingGoalsStore();
  const { isEditing } = useHandleEditStore();
  const [editableItems, setEditableItems] = useState(coachingGoalsItems);
  const coachingGoalsContentRef = useRef(null);

  useEffect(() => {
    // Sync the editable items with the coachingGoalsItems from the store whenever they change
    setEditableItems(coachingGoalsItems);
  }, [coachingGoalsItems]);

  const handleInputChange = (index, event) => {
    const updatedItems = [...editableItems];
    updatedItems[index] = event.target.value;
    setEditableItems(updatedItems);
  };

  const handleBlur = () => {
    // Save changes to the store when the user clicks outside
    setCoachingGoalsItems(editableItems);  // Update the store
    ENABLE_CONSOLE_LOGS && console.log('Updated Coaching Goals Items:', editableItems);  // Log the updated data
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
