// frontend\src\components\13c.big-ideas\1.BigIdeasTable\BigIdeasTable.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import useBigIdeasStore, { initialBigIdeas } from '../../../store/left-lower-content/13.tools/3.bigIdeasStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './BigIdeasTable.css';

const BigIdeasTable = () => {
  const organization = useLayoutSettingsStore.getState().organization;
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });

  const loggedUser = useLoginStore((state) => state.user);
  const bigIdeasTable = useBigIdeasStore((state) => state.bigIdeasTable);
  const setBigIdeasTable = useBigIdeasStore((state) => state.setBigIdeasTable);
  const updateBigIdeasTableField = useBigIdeasStore((state) => state.updateBigIdeasTableField);
  const pushBigIdeasTable = useBigIdeasStore((state) => state.pushBigIdeasTable);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBigIdeasTable, setNewBigIdeasTable] = useState({
    date: '',
    who: '',
    description: '',
    impact: '',
    when: '',
    evaluator: '',
    comments: '',
  });

  const [currentOrder, setCurrentOrder] = useState(bigIdeasTable);
  const [draggedId, setDraggedId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('BigIdeasTableData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setBigIdeasTable(parsedData);

        ENABLE_CONSOLE_LOGS && console.log('BigIdeasTableData found! and  loaded!');


        // ✅ Treat this as unsaved state, trigger the buttons
        setIsEditing(true);


      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Failed to parse BigIdeasTableData from localStorage:', err);
      }
    }
  }, [setBigIdeasTable]);

  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add BigIdeas Table button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  // const handleAddNewBigIdeasTable = () => {
  //   ENABLE_CONSOLE_LOGS && console.log('New BigIdeas Table', JSON.stringify(newBigIdeasTable, null, 2));

  //   // 2. Hide Save / Discharge
  //   setIsEditing(false);

  
  //   // 3. Remove localStorage temp data
  //   localStorage.removeItem('BigIdeasTableData');
  
  //   // 4. Push to Zustand store
  //   pushBigIdeasTable(newBigIdeasTable);
  
  //   // 5. Optionally: force-refresh the UI by resetting store (if needed)
  //   // Not required unless you deep reset from localStorage elsewhere
  
  //   // Close modal
  //   setShowAddModal(false);
  
  //   // Reset form input
  //   setNewBigIdeasTable({     
  //     date: '',
  //     who: '',
  //     description: '',
  //     impact: '',
  //     when: '',
  //     evaluator: '',
  //     comments: '',
  //   });

  // };


  const handleAddNewBigIdeasTable = async () => {
    ENABLE_CONSOLE_LOGS && console.log('New BigIdeas Table', JSON.stringify(newBigIdeasTable, null, 2));
  
    const organization = useLayoutSettingsStore.getState().organization;
  
    try {
      // Step 1: Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
  
      const { csrf_token } = await csrfRes.json();
  
      // Step 2: Send new big idea
      const response = await fetch(`${API_URL}/v1/tools/big-ideas/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          bigIdea: newBigIdeasTable,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('Failed to add big idea:', result.message || 'Unknown error');
        return;
      }
  
      ENABLE_CONSOLE_LOGS && console.log('✅ Added Big Idea:', result.newItem);
  
      // Step 3: Update UI
      pushBigIdeasTable(result.newItem);
      setIsEditing(false);
      setShowAddModal(false);
      setNewBigIdeasTable({
        date: '',
        who: '',
        description: '',
        impact: '',
        when: '',
        evaluator: '',
        comments: '',
      });
  
      localStorage.removeItem('BigIdeasTableData');
  
    } catch (error) {
      console.error('❌ Add Big Idea API error:', error);
    }
  };
  
  const handleCellClick = (id, field) => {
    if (loggedUser?.role === 'superadmin') {
      setEditingCell({ id, field });
    }
  };

  const handleInputBlur = (id, field, value) => {
    updateBigIdeasTableField(id, field, value);

    // Update local state for Save/Discharge buttons
    setIsEditing(true);

    // Update localStorage
    const updatedDrivers = bigIdeasTable.map((driver) =>
      driver.id === id ? { ...driver, [field]: value } : driver
    );
    localStorage.setItem('BigIdeasTableData', JSON.stringify(updatedDrivers));

    setEditingCell({ id: null, field: null });
  };

  
  const saveToBackend = async (reordered) => {
    try {
      const encodedOrg = encodeURIComponent(organization);

      // Step 1: Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });

      const { csrf_token } = await csrfRes.json();

      // Step 2: Send POST request
      const res = await fetch(`${API_URL}/v1/tools/big-ideas/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          toolsBigIdeasData: reordered,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ Updated toolsBigIdeasData:', result);
      } else if (res.status === 401) {
        console.error('❌ Unauthorized: Session expired.');
      } else {
        console.error('❌ Failed to update Big Ideas:', result.message);
      }
    } catch (error) {
      console.error('❌ Error updating Big Ideas:', error);
    }
  };


  const handleSaveChanges = () => {

    setLoadingSave(true);
  
    setTimeout(() => {
      setLoadingSave(false);
  
      const storedData = localStorage.getItem('BigIdeasTableData');
  
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
  
          // 1. Log to console
          ENABLE_CONSOLE_LOGS && console.log('Saved BigIdeas Table after Save Changes Button:', parsedData);
  
          // 2. Update Zustand store
          setBigIdeasTable(parsedData);

          // Reindex IDs
          const reordered = parsedData.map((driver, index) => ({
            ...driver,
            id: index + 1,
          }));

          ENABLE_CONSOLE_LOGS &&  console.log('Saved BigIdeas Table (Reindexed):', reordered);

          setBigIdeasTable(reordered);
          saveToBackend(reordered);
  
          // 3. Clear edited state (hides buttons)
          setIsEditing(false);

  
          // 4. Remove from localStorage
          localStorage.removeItem('BigIdeasTableData');
        } catch (err) {
          ENABLE_CONSOLE_LOGS && console.error('Error parsing BigIdeasTableData on save:', err);
        }
      } else {

        // No localStorage changes, use current drag order

        const reordered = currentOrder.map((driver, index) => ({
          ...driver,
          id: index + 1,
        }));

        ENABLE_CONSOLE_LOGS &&  console.log('Saved BigIdeas Table (reordered):', reordered);

        saveToBackend(reordered);
        setBigIdeasTable(reordered);
        setIsEditing(false);


        // Remove from localStorage
        localStorage.removeItem('BigIdeasTableData');

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
    localStorage.removeItem('BigIdeasTableData');

    // 2. Clear edited state (hides buttons)
    setIsEditing(false);

    // 3. Update Zustand store
    // setBigIdeasTable(initialBigIdeas);

    const { baselineBigIdeasTable } = useBigIdeasStore.getState();

    // ✅ Console log to inspect baselineBigIdeasTable before setting
    ENABLE_CONSOLE_LOGS &&  console.log('💾 Restoring baselineBigIdeasTable:', baselineBigIdeasTable);

    setBigIdeasTable(baselineBigIdeasTable);

    // 4. refresh the table
    setCurrentOrder(baselineBigIdeasTable);

    // 5. Hide Modal
    setShowConfirmModal(false);

  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };


  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(bigIdeasTable);
  }, [bigIdeasTable]);

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
    localStorage.setItem('BigIdeasTableData', JSON.stringify(currentOrder));
  
    // Also flag changes for Save/Discharge buttons
    setIsEditing(true);

  
    ENABLE_CONSOLE_LOGS && console.log('Drag ended and saved to localStorage:', currentOrder);
  };

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setBigIdeasTable(currentOrder);
    setIsEditing(false);

  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('BigIdeasTableData');
    setShowConfirmModal(false);
    setCurrentOrder(bigIdeasTable);
    setIsEditing(false);
  };

  const isSkeleton = bigIdeasTable.some(driver => 
    driver.description === '-' &&
    driver.status === '-'
  );

  const handleDeleteDriver = (id) => {
    const updated = bigIdeasTable.filter(driver => driver.id !== id);
    setBigIdeasTable(updated);
    localStorage.setItem('BigIdeasTableData', JSON.stringify(updated));
  
    // Mark as edited
    setIsEditing(true);

  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Big Ideas</h5>
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
                  Add Big Idea
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
              <th className="border px-4 py-2 ">Date</th>
              <th className="border px-4 py-2 ">Who</th>
              <th className="border px-4 py-2 ">Description</th>
              <th className="border px-4 py-2 ">Impact</th>
              <th className="border px-4 py-2 ">When</th>
              <th className="border px-4 py-2 ">Evaluator</th>
              <th className="border px-4 py-2 ">Comments</th>
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
                  driver.description !== '-' &&
                  driver.impact !== '-' &&
                  driver.when !== '-' &&
                  driver.evaluator !== '-' &&
                  driver.comments !== '-' 
                }
                onDragStart={
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.description !== '-' &&
                  driver.impact !== '-' &&
                  driver.when !== '-' &&
                  driver.evaluator !== '-' &&
                  driver.comments !== '-' 
                    ? (e) => handleDragStart(e, driver.id)
                    : undefined
                }
                onDragOver={
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.description !== '-' &&
                  driver.impact !== '-' &&
                  driver.when !== '-' &&
                  driver.evaluator !== '-' &&
                  driver.comments !== '-' 
                    ? (e) => handleDragOver(e, driver.id)
                    : undefined
                }
                onDragEnd={
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.description !== '-' &&
                  driver.impact !== '-' &&
                  driver.when !== '-' &&
                  driver.evaluator !== '-' &&
                  driver.comments !== '-' 
                    ? handleDragEnd
                    : undefined
                }
                className={`hover:bg-gray-50 ${
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.description !== '-' &&
                  driver.impact !== '-' &&
                  driver.when !== '-' &&
                  driver.evaluator !== '-' &&
                  driver.comments !== '-' 
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
                      defaultValue={driver.date} // ensure it's in YYYY-MM-DD format
                      onBlur={(e) => handleInputBlur(driver.id, 'date', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />

                  ) : (
                    driver.date
                  )}
                </td>

                {/* who */}
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
                      rows={3}
                    />
                  ) : (
                    driver.who
                  )}
                </td>

                {/* description */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.description !== '-' && handleCellClick(driver.id, 'description')}
                >
                  {driver.description === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'description' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.description}
                      onBlur={(e) => handleInputBlur(driver.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.description
                  )}
                </td>

                {/* impact */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.impact !== '-' && handleCellClick(driver.id, 'impact')}
                >
                  {driver.impact === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'impact' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.impact}
                      onBlur={(e) => handleInputBlur(driver.id, 'impact', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.impact
                  )}
                </td>

                {/* when */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.when !== '-' && handleCellClick(driver.id, 'when')}
                >
                  {driver.when === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'when' ? (

                    <input
                      type="date"
                      autoFocus
                      defaultValue={driver.when} // ensure it's in YYYY-MM-DD format
                      onBlur={(e) => handleInputBlur(driver.id, 'when', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />

                  ) : (
                    driver.when
                  )}
                </td>

                {/* evaluator */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.evaluator !== '-' && handleCellClick(driver.id, 'evaluator')}
                >
                  {driver.evaluator === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'evaluator' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.evaluator}
                      onBlur={(e) => handleInputBlur(driver.id, 'evaluator', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.evaluator
                  )}
                </td>

                {/* comments */}
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
            className="modal-add-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-add-title">Add Big Idea</div>


            <label className="modal-add-label">Date</label>
            <input
              type="date"
              className="modal-add-input"
              value={newBigIdeasTable.date}
              onChange={(e) =>
                setNewBigIdeasTable({ ...newBigIdeasTable, date: e.target.value })
              }
            />

            <label className="modal-add-label">Who</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newBigIdeasTable.who}
              onChange={(e) => setNewBigIdeasTable({ ...newBigIdeasTable, who: e.target.value })}
            />

            <label className="modal-add-label">Description</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newBigIdeasTable.description}
              onChange={(e) => setNewBigIdeasTable({ ...newBigIdeasTable, description: e.target.value })}
            />

            <label className="modal-add-label">Impact</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newBigIdeasTable.impact}
              onChange={(e) => setNewBigIdeasTable({ ...newBigIdeasTable, impact: e.target.value })}
            />

            <label className="modal-add-label">When</label>
            <input
              type="date"
              className="modal-add-input"
              value={newBigIdeasTable.when}
              onChange={(e) =>
                setNewBigIdeasTable({ ...newBigIdeasTable, when: e.target.value })
              }
            />

            <label className="modal-add-label">Evaluator</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newBigIdeasTable.evaluator}
              onChange={(e) => setNewBigIdeasTable({ ...newBigIdeasTable, evaluator: e.target.value })}
            />

            <label className="modal-add-label">Comments</label>
            <textarea
              className="modal-add-input"
              rows="2"
              value={newBigIdeasTable.comments}
              onChange={(e) => setNewBigIdeasTable({ ...newBigIdeasTable, comments: e.target.value })}
            />

            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAddNewBigIdeasTable}>Add</button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default BigIdeasTable;
