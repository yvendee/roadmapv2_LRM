// frontend\src\components\12.coaching-alignment\2.CurrentBusinessPulse\CurrentBusinessPulse.jsx
import React, { useState, useEffect } from 'react';
import useBusinessPulseStore from '../../../store/left-lower-content/12.coaching-alignment/2.currentBusinessPulseStore';
import { useHandleEditStore } from '../../../store/left-lower-content/12.coaching-alignment/0.handleEditStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; 
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './CurrentBusinessPulse.css';

const CurrentBusinessPulse = () => {
  const { pulseItems, updatePulseItem, setPulseItems } = useBusinessPulseStore();
  const { isEditing } = useHandleEditStore();
  const [editablePulseItems, setEditablePulseItems] = useState(pulseItems);

  useEffect(() => {
    setEditablePulseItems(pulseItems);
  }, [pulseItems]);

  const handleInputChange = (index, field, value) => {
    const updatedPulseItems = [...editablePulseItems];
    updatedPulseItems[index][field] = value;
    setEditablePulseItems(updatedPulseItems);
  };

  const handleBlur = () => {
    setPulseItems(editablePulseItems);
    ENABLE_CONSOLE_LOGS && console.log('Updated Pulse Items:', editablePulseItems);
  };

  const handleAddPulseItem = () => {
    const newPulseItem = {
      category: 'New Category',
      rating: '1',
      notes: [],
    };

    const updatedPulseItems = [...editablePulseItems, newPulseItem];
    setEditablePulseItems(updatedPulseItems);
    ENABLE_CONSOLE_LOGS && console.log('Newly Added Pulse Item:', newPulseItem);
  };

  const handleAddNote = (index) => {
    const updatedPulseItems = [...editablePulseItems];
    updatedPulseItems[index].notes.push('');
    setEditablePulseItems(updatedPulseItems);
  };

  const handleDeleteItem = (index) => {
    const itemToDelete = editablePulseItems[index];
    ENABLE_CONSOLE_LOGS && console.log('Deleting item:', itemToDelete);

    const updatedPulseItems = editablePulseItems.filter((_, i) => i !== index);
    setEditablePulseItems(updatedPulseItems);
    setPulseItems(updatedPulseItems);
  };

  return (
    <div className="pulse-card">
      <div className="pulse-header">
        <h4>Current Business Pulse</h4>
        <p>Rate each on a scale of 1–5 (1 = low, 5 = strong)</p>
      </div>

      <div className="pulse-table">
        <div className="pulse-row pulse-header-row">
          <div className="pulse-col category">Category</div>
          <div className="pulse-col rating">Rating (1-5)</div>
          <div className="pulse-col notes">Notes / Observations</div>
          <div className="pulse-col actions">Actions</div>
        </div>

        {editablePulseItems.map((item, index) => (
          <div className="pulse-row" key={index}>
            <div className="pulse-col category">
              {isEditing ? (
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) =>
                    handleInputChange(index, 'category', e.target.value)
                  }
                  onBlur={handleBlur}
                  className="pulse-input"
                />
              ) : (
                <span>{item.category}</span>
              )}
            </div>

            <div className="pulse-col rating">
              {isEditing ? (
                <input
                  type="number"
                  value={item.rating}
                  min="1"
                  max="5"
                  onChange={(e) =>
                    handleInputChange(index, 'rating', e.target.value)
                  }
                  onBlur={handleBlur}
                  className="pulse-input"
                />
              ) : (
                <span className={`rating-badge ${item.rating === 'N/A' ? 'na' : ''}`}>
                  {item.rating}
                </span>
              )}
            </div>

            <div className="pulse-col notes">
              {isEditing ? (
                <div>
                  {item.notes.map((note, noteIndex) => (
                    <div key={noteIndex}>
                      <textarea
                        value={note}
                        onChange={(e) =>
                          handleInputChange(index, 'notes', [
                            ...item.notes.slice(0, noteIndex),
                            e.target.value,
                            ...item.notes.slice(noteIndex + 1),
                          ])
                        }
                        onBlur={handleBlur}
                        className="pulse-note-textarea"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddNote(index)}
                    className="btn btn-secondary btn-sm mt-2"
                  >
                    Add New Note
                  </button>
                </div>
              ) : (
                <ul>
                  {item.notes.map((note, noteIndex) => (
                    <li key={noteIndex}>{note}</li>
                  ))}
                </ul>
              )}
            </div>

            {isEditing && (
              <div className="pulse-col actions">
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="delete-button"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Replaced with gray 'Add New Line' button */}
        {isEditing && (
          <button
            onClick={handleAddPulseItem}
            className="btn btn-secondary btn-sm mt-2"
          >
            Add New Line
          </button>
        )}
      </div>
    </div>
  );
};

export default CurrentBusinessPulse;
