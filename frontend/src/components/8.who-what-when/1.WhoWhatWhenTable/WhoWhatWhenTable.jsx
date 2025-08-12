// frontend\src\components\8.who-what-when\1.WhoWhatWhenTable\WhoWhatWhenTable.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import useWhoWhatWhenStore, { initialWhoWhatWhen } from '../../../store/left-lower-content/8.who-what-when/1.whoWhatWhenStore';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './WhoWhatWhenTable.css';

const WhoWhatWhenTable = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });

  const loggedUser = useLoginStore((state) => state.user);
  const whoWhatWhen = useWhoWhatWhenStore((state) => state.whoWhatWhen);
  const setWhoWhatWhen = useWhoWhatWhenStore((state) => state.setWhoWhatWhen);
  const updateWhoWhatWhenField = useWhoWhatWhenStore((state) => state.updateWhoWhatWhenField);
  const pushWhoWhatWhen = useWhoWhatWhenStore((state) => state.pushWhoWhatWhen);

  const [inputValue, setInputValue] = React.useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newWhoWhatWhen, setNewWhoWhatWhen] = useState({
    date: '',
    who: '',
    what: '',
    deadline: '',
    comments: '',
    status: '0',
  });

  const [currentOrder, setCurrentOrder] = useState(whoWhatWhen);
  const [draggedId, setDraggedId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  
  
  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('whoWhatWhenData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setWhoWhatWhen(parsedData);

        ENABLE_CONSOLE_LOGS && console.log('whoWhatWhenData found! and  loaded!');

        // ✅ Treat this as unsaved state, trigger the buttons
        setIsEditing(true);

      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Failed to parse whoWhatWhenData from localStorage:', err);
      }
    }
  }, [setWhoWhatWhen]);

  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowAddModal(true);
    }, 1000);
  };

//   const handleAddNewWhoWhatWhen = () => {
//     ENABLE_CONSOLE_LOGS && console.log('New Who What When', JSON.stringify(newWhoWhatWhen, null, 2));

//     // 2. Hide Save / Discharge
//     setIsEditing(false);

  
//     // 3. Remove localStorage temp data
//     localStorage.removeItem('whoWhatWhenData');
  
//     // 4. Push to Zustand store
//     pushWhoWhatWhen(newWhoWhatWhen);
  
//     // 5. Optionally: force-refresh the UI by resetting store (if needed)
//     // Not required unless you deep reset from localStorage elsewhere
  
//     // Close modal
//     setShowAddModal(false);
  
//     // Reset form input
//     setNewWhoWhatWhen({ date: '', who: '', what: '', deadline: '', comments: '', status: '0' });
//   };

    const handleAddNewWhoWhatWhen = () => {
        ENABLE_CONSOLE_LOGS && console.log('New Who What When', JSON.stringify(newWhoWhatWhen, null, 2));
    
        // 1. Push new data to Zustand store
        pushWhoWhatWhen(newWhoWhatWhen);
    
        // 2. Get updated data from store
        const updatedData = useWhoWhatWhenStore.getState().whoWhatWhen;
    
        // 3. Save updated data to localStorage
        localStorage.setItem('whoWhatWhenData', JSON.stringify(updatedData));
    
        // 4. Show Save / Discharge buttons
        setIsEditing(true);
    
        // 5. Close modal
        setShowAddModal(false);
    
        // 6. Reset form input
        setNewWhoWhatWhen({ date: '', who: '', what: '', deadline: '', comments: '', status: '0' });
    };
    



    // When you start editing, initialize inputValue:
    const handleCellClick = (id, field) => {
      setEditingCell({ id, field });
      const driver = whoWhatWhen.find((d) => d.id === id);
      setInputValue(driver[field]);
      };

      const handleInputChange = (e) => {
      setInputValue(e.target.value);
      };

      const handleInputBlur = (id, field) => {
      updateWhoWhatWhenField(id, field, inputValue);

      // Update local state for Save/Discharge buttons
      setIsEditing(true);

      // Update localStorage
      const updatedDrivers = whoWhatWhen.map((driver) =>
          driver.id === id ? { ...driver, [field]: inputValue } : driver
      );
      localStorage.setItem('whoWhatWhenData', JSON.stringify(updatedDrivers));

      setEditingCell({ id: null, field: null });
    };



  
  const handleSaveChanges = () => {

    setLoadingSave(true);
  
    setTimeout(() => {
      setLoadingSave(false);
  
      const storedData = localStorage.getItem('whoWhatWhenData');
  
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
  
          // 1. Log to console
          ENABLE_CONSOLE_LOGS && console.log('Saved Who-What-When after Save Changes Button:', parsedData);
  
          // 2. Update Zustand store
          setWhoWhatWhen(parsedData);

          // Reindex IDs
          const reordered = parsedData.map((driver, index) => ({
            ...driver,
            id: index + 1,
          }));

          ENABLE_CONSOLE_LOGS &&  console.log('Saved Who-What-When (Reindexed):', reordered);

          setWhoWhatWhen(reordered);
  
          // 3. Clear edited state (hides buttons)
          setIsEditing(false);
  
          // 4. Remove from localStorage
          localStorage.removeItem('whoWhatWhenData');
        } catch (err) {
          ENABLE_CONSOLE_LOGS && console.error('Error parsing Who-What-When Data on save:', err);
        }
      } else {

        // No localStorage changes, use current drag order
        const reordered = currentOrder.map((driver, index) => ({
          ...driver,
          id: index + 1,
        }));

        ENABLE_CONSOLE_LOGS &&  console.log('Saved Who-What-When(reordered):', reordered);
        setWhoWhatWhen(reordered);
        setIsEditing(false);


        // Remove from localStorage
        localStorage.removeItem('whoWhatWhenData');

      }
    }, 1000);
  };
  
  
  const handleDischargeChanges = () => {
    setLoadingDischarge(true);
    setTimeout(() => {
      setLoadingDischarge(false);
      setShowConfirmModal(true);
    }, 1000);
  };

  const confirmDischargeChanges = () => {
    // 1. Remove from localStorage
    localStorage.removeItem('whoWhatWhenData');

    // 2. Clear edited state (hides buttons)
    // setEditedAnnualPriorities([]);
    setIsEditing(false);


    // 3. Update Zustand store
    setWhoWhatWhen(initialWhoWhatWhen);

    // 4. Hide Modal
    setShowConfirmModal(false);
  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };


  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(whoWhatWhen);
  }, [whoWhatWhen]);

  // Drag handlers:
  const handleDragStart = (e, id) => {
    setDraggedId(id);
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id === draggedId) return;

    const draggedIndex = currentOrder.findIndex(d => d.id === draggedId);
    const overIndex = currentOrder.findIndex(d => d.id === id);
    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(overIndex, 0, moved);
    setCurrentOrder(newOrder);
    setIsEditing(true);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  
    // Save the new drag order to localStorage
    localStorage.setItem('whoWhatWhenData', JSON.stringify(currentOrder));
  
    // Also flag changes for Save/Discharge buttons
    setIsEditing(true);


    ENABLE_CONSOLE_LOGS && console.log('Drag ended and saved to localStorage:', currentOrder);
  };

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setWhoWhatWhen(currentOrder);
    setIsEditing(false);

  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('whoWhatWhenData');
    setShowConfirmModal(false);
    setCurrentOrder(whoWhatWhen);
    setIsEditing(false);

  };

  const isSkeleton = whoWhatWhen.some(driver => 
    driver.date === '-' &&
    driver.who === '-' &&
    driver.what === '-' &&
    driver.deadline === '-' &&
    driver.comments === '-' &&
    driver.status === '-'
  );

  const handleDeleteDriver = (id) => {
    const updated = whoWhatWhen.filter(driver => driver.id !== id);
    setWhoWhatWhen(updated);
    localStorage.setItem('whoWhatWhenData', JSON.stringify(updated));
  
    // Mark as edited
    setIsEditing(true);

  };

  

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Who What When</h5>
        {loggedUser?.role === 'superadmin' && (
          <div className="flex gap-2">

            {isEditing && <>
                <button className="pure-green-btn" onClick={handleSaveChanges}>
                {loadingSave ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  ) : (
                    'Save Changes'
                )}
                </button>
                <button className="pure-red-btn" onClick={handleDischargeChanges}>
                  {loadingDischarge ? (
                    <div className="loader-bars">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    ) : (
                      'Discard'
                  )}
                </button>
              </>
            }

            {loggedUser?.role === 'superadmin' && !isSkeleton && (
              <button className="pure-blue-btn ml-2" onClick={handleAddDriverClick} disabled={loading}>
                {loading ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <>
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add
                  </>
                )}
              </button>
            )}

          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2 ">Date (Item Logged)</th>
              <th className="border px-4 py-2 ">Who</th>
              <th className="border px-4 py-2 ">What</th>
              <th className="border px-4 py-2 ">When (Deadline)</th>
              <th className="border px-4 py-2 ">Comments and Challenges</th>
              <th className="border px-4 py-2"></th>
              {loggedUser?.role === 'superadmin' && !isSkeleton && (
                <th className="border px-4 py-2 text-center"></th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentOrder.map(driver => (
              <tr key={driver.id}

                draggable={
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.what !== '-' &&
                  driver.deadline !== '-' &&
                  driver.comments !== '-' &&
                  driver.status !== '-'
                }
                onDragStart={
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.what !== '-' &&
                  driver.deadline !== '-' &&
                  driver.comments !== '-' &&
                  driver.status !== '-'
                    ? (e) => handleDragStart(e, driver.id)
                    : undefined
                }
                onDragOver={
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.what !== '-' &&
                  driver.deadline !== '-' &&
                  driver.comments !== '-' &&
                  driver.status !== '-'
                    ? (e) => handleDragOver(e, driver.id)
                    : undefined
                }
                onDragEnd={
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.what !== '-' &&
                  driver.deadline !== '-' &&
                  driver.comments !== '-' &&
                  driver.status !== '-'
                    ? handleDragEnd
                    : undefined
                }
                className={`hover:bg-gray-50 ${
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.what !== '-' &&
                  driver.deadline !== '-' &&
                  driver.comments !== '-' &&
                  driver.status !== '-'
                    ? 'cursor-move'
                    : 'cursor-default'
                }`}
              >

                {/* Implement skeleton  Loading */}
                
                {/* id */}
                <td className="border px-4 py-3">{isSkeleton ? <div className="skeleton w-6"></div> : driver.id}</td>

                {/* date */}
                <td
                    className="border px-4 py-3 cursor-pointer"
                    onClick={() => driver.date !== '-' && handleCellClick(driver.id, 'date')}
                    >
                    {driver.date === '-' ? (
                        <div className="skeleton w-64 h-5"></div>
                    ) : editingCell.id === driver.id && editingCell.field === 'date' ? (
                        <input
                        type="date"
                        autoFocus
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur(driver.id, 'date')}
                        className="w-full px-2 py-1 border rounded"
                        />
                    ) : (
                        driver.date
                    )}
                </td>



                
                {/* Who */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.who !== '-' && handleCellClick(driver.id, 'who')}
                >
                  {driver.who === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'who' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.who}
                      onBlur={(e) => handleInputBlur(driver.id, 'who', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.who
                  )}
                </td>

                {/* What */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.what !== '-' && handleCellClick(driver.id, 'what')}
                >
                  {driver.what === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'what' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.what}
                      onBlur={(e) => handleInputBlur(driver.id, 'what', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.what
                  )}
                </td>

                {/* deadline */}
                <td
                    className="border px-4 py-3 cursor-pointer"
                    onClick={() => driver.deadline !== '-' && handleCellClick(driver.id, 'deadline')}
                    >
                    {driver.deadline === '-' ? (
                        <div className="skeleton w-64 h-5"></div>
                    ) : editingCell.id === driver.id && editingCell.field === 'deadline' ? (
                        <input
                        type="date"
                        autoFocus
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur(driver.id, 'deadline')}
                        className="w-full px-2 py-1 border rounded"
                        />
                    ) : (
                        driver.deadline
                    )}
                </td>

                {/* Comments */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.comments !== '-' && handleCellClick(driver.id, 'comments')}
                >
                  {driver.comments === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'comments' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.comments}
                      onBlur={(e) => handleInputBlur(driver.id, 'comments', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.comments
                  )}
                </td>

                {/* status */}
                <td>
                  <div
                    className="mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      driver.status !== '-' && handleCellClick(driver.id, 'status');
                    }}
                  >
                    {driver.status === '-' ? (
                      <div className="skeleton w-16 h-5 mx-auto"></div>
                    ) : editingCell.id === driver.id && editingCell.field === 'status' ? (
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="^\d+(\.\d{0,2})?$"
                      autoFocus
                      defaultValue={driver.status.replace('%', '')}
                      onBlur={(e) => {
                        let rawValue = e.target.value.trim().replace('%', '');
                        let numeric = parseFloat(rawValue);

                        if (isNaN(numeric)) numeric = 0;

                        const formatted = `${numeric.toFixed(2)}%`;
                        handleInputBlur(driver.id, 'status', formatted);
                      }}
                      className="w-full px-2 py-1 border rounded text-xs text-center"
                    />

                    ) : (
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          driver.status === '100.00%'
                            ? 'bg-green-100 text-green-700'
                            : driver.status === '83.33%'
                            ? 'bg-red-100 text-red-700'
                            : driver.status === '0.00%'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {driver.status}
                      </span>
                    )}
                  </div>
                </td>
                
                {/* delete button */}
                {loggedUser?.role === 'superadmin' && !isSkeleton && (
                  <td className="border px-4 py-3 text-center">
                    <div
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </div>
                  </td>
                )}
                
              </tr>
            ))}
          </tbody>

        </table>
      </div>


        {showConfirmModal && (
        <div className="modal-add-overlay" onClick={() => setShowConfirmModal(false)}>
            <div className="modal-add-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-add-title">Confirm Discard</div>
            <p className="text-gray-700 text-sm mb-4">
                Are you sure you want to discard all unsaved changes?
            </p>
            <div className="modal-add-buttons">
                <button className="btn-add" onClick={confirmDischargeChanges}>Yes, Discard</button>
                <button className="btn-close" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
            </div>
        </div>
        )}

        {showAddModal && (
        <div
            className="modal-add-overlay"
            onClick={() => setShowAddModal(false)}
        >
            <div
            className="modal-add-box w-[500px] max-h-[600px] bg-white rounded-lg p-5 overflow-y-auto shadow-md"
            onClick={(e) => e.stopPropagation()}
            >
            <div className="modal-add-title">Add Who What When</div>

            <label className="modal-add-label">Date</label>
            <input
                type="date"
                className="modal-add-input"
                value={newWhoWhatWhen.date}
                onChange={(e) => setNewWhoWhatWhen({ ...newWhoWhatWhen, date: e.target.value })}
            />

            <label className="modal-add-label">Who</label>
            <textarea
                className="modal-add-input"
                rows="3"
                value={newWhoWhatWhen.who}
                onChange={(e) => setNewWhoWhatWhen({ ...newWhoWhatWhen, who: e.target.value })}
            />

            <label className="modal-add-label">What</label>
            <textarea
                className="modal-add-input"
                rows="3"
                value={newWhoWhatWhen.what}
                onChange={(e) => setNewWhoWhatWhen({ ...newWhoWhatWhen, what: e.target.value })}
            />

            <label className="modal-add-label">Deadline</label>
            <input
                type="date"
                className="modal-add-input"
                value={newWhoWhatWhen.deadline}
                onChange={(e) => setNewWhoWhatWhen({ ...newWhoWhatWhen, deadline: e.target.value })}
            />

            <label className="modal-add-label">Comments</label>
            <textarea
                className="modal-add-input"
                rows="3"
                value={newWhoWhatWhen.comments}
                onChange={(e) => setNewWhoWhatWhen({ ...newWhoWhatWhen, comments: e.target.value })}
            />

            <label className="modal-add-label">Status</label>
            <div className="relative">
            <input
                type="text"
                className="modal-add-input pr-8" // add right padding for percent sign
                value={newWhoWhatWhen.status.replace('%', '')} // show only number part
                onChange={(e) => {
                const val = e.target.value;
                // Allow empty or valid decimal number only
                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                    setNewWhoWhatWhen({ ...newWhoWhatWhen, status: val + '%' });
                }
                }}
            />
            <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none"
                style={{ userSelect: 'none' }}
            >
                %
            </span>
            </div>


            <div className="modal-add-buttons">
                <button className="btn-add" onClick={handleAddNewWhoWhatWhen}>Add</button>
                <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
            </div>
        </div>
        )}


    </div>

  );
};

export default WhoWhatWhenTable;
