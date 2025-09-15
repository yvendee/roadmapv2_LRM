// frontend\src\components\13b.victories\1.VictoriesTable\VictoriesTable.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import useVictoriesStore, { initialVictories } from '../../../store/left-lower-content/13.tools/2.victoriesStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './VictoriesTable.css';

const VictoriesTable = () => {
  const organization = useLayoutSettingsStore.getState().organization;
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });

  const loggedUser = useLoginStore((state) => state.user);
  const victoriesTable = useVictoriesStore((state) => state.victoriesTable);
  const setVictoriesTable = useVictoriesStore((state) => state.setVictoriesTable);
  const updateVictoriesTableField = useVictoriesStore((state) => state.updateVictoriesTableField);
  const pushVictoriesTable = useVictoriesStore((state) => state.pushVictoriesTable);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newVictoriesTable, setNewVictoriesTable] = useState({
    date: '',
    who: '',
    milestones: '',
    notes: '',
  });

  const [currentOrder, setCurrentOrder] = useState(victoriesTable);
  const [draggedId, setDraggedId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('VictoriesTableData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setVictoriesTable(parsedData);

        ENABLE_CONSOLE_LOGS && console.log('VictoriesTableData found! and  loaded!');


        // ✅ Treat this as unsaved state, trigger the buttons
        setIsEditing(true);


      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Failed to parse VictoriesTableData from localStorage:', err);
      }
    }
  }, [setVictoriesTable]);

  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add Victories Table button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  // const handleAddNewVictoriesTable = () => {
  //   ENABLE_CONSOLE_LOGS && console.log('New Victories Table', JSON.stringify(newVictoriesTable, null, 2));

  //   // 2. Hide Save / Discharge
  //   setIsEditing(false);

  
  //   // 3. Remove localStorage temp data
  //   localStorage.removeItem('VictoriesTableData');
  
  //   // 4. Push to Zustand store
  //   pushVictoriesTable(newVictoriesTable);
  
  //   // 5. Optionally: force-refresh the UI by resetting store (if needed)
  //   // Not required unless you deep reset from localStorage elsewhere
  
  //   // Close modal
  //   setShowAddModal(false);
  
  //   // Reset form input
  //   setNewVictoriesTable({     
  //     date: '',
  //     who: '',
  //     milestones: '',
  //     notes: '',
  //   });

  // };


  const handleAddNewVictoriesTable = async () => {
    ENABLE_CONSOLE_LOGS && console.log('New Victories Table', JSON.stringify(newVictoriesTable, null, 2));
  
    const organization = useLayoutSettingsStore.getState().organization;
  
    try {
      // Step 1: Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
  
      const { csrf_token } = await csrfRes.json();
  
      // Step 2: Send new victory
      const response = await fetch(`${API_URL}/v1/tools/victories/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          victory: newVictoriesTable,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('Failed to add victory:', result.message || 'Unknown error');
        return;
      }
  
      ENABLE_CONSOLE_LOGS && console.log('✅ Added Victory:', result.newItem);
  
      // Step 3: Update UI
      pushVictoriesTable(result.newItem);
      setIsEditing(false);
      setShowAddModal(false);
      setNewVictoriesTable({
        date: '',
        who: '',
        milestones: '',
        notes: '',
      });
      localStorage.removeItem('VictoriesTableData');
  
    } catch (error) {
      console.error('❌ Add Victory API error:', error);
    }
  };
  
  const handleCellClick = (id, field) => {
    if (loggedUser?.role === 'superadmin') {
      setEditingCell({ id, field });
    }
  };

  const handleInputBlur = (id, field, value) => {
    updateVictoriesTableField(id, field, value);

    // Update local state for Save/Discharge buttons
    setIsEditing(true);

    // Update localStorage
    const updatedDrivers = victoriesTable.map((driver) =>
      driver.id === id ? { ...driver, [field]: value } : driver
    );
    localStorage.setItem('VictoriesTableData', JSON.stringify(updatedDrivers));

    setEditingCell({ id: null, field: null });
  };

  
  // const handleSaveChanges = () => {

  //   setLoadingSave(true);
  
  //   setTimeout(() => {
  //     setLoadingSave(false);
  
  //     const storedData = localStorage.getItem('VictoriesTableData');
  
  //     if (storedData) {
  //       try {
  //         const parsedData = JSON.parse(storedData);
  
  //         // 1. Log to console
  //         ENABLE_CONSOLE_LOGS && console.log('Saved Victories Table after Save Changes Button:', parsedData);
  
  //         // 2. Update Zustand store
  //         setVictoriesTable(parsedData);

  //         // Reindex IDs
  //         const reordered = parsedData.map((driver, index) => ({
  //           ...driver,
  //           id: index + 1,
  //         }));

  //         ENABLE_CONSOLE_LOGS &&  console.log('Saved Victories Table (Reindexed):', reordered);

  //         setVictoriesTable(reordered);
  
  //         // 3. Clear edited state (hides buttons)
  //         setIsEditing(false);

  
  //         // 4. Remove from localStorage
  //         localStorage.removeItem('VictoriesTableData');
  //       } catch (err) {
  //         ENABLE_CONSOLE_LOGS && console.error('Error parsing VictoriesTableData on save:', err);
  //       }
  //     } else {

  //       // No localStorage changes, use current drag order

  //       const reordered = currentOrder.map((driver, index) => ({
  //         ...driver,
  //         id: index + 1,
  //       }));

  //       ENABLE_CONSOLE_LOGS &&  console.log('Saved Victories Table (reordered):', reordered);
  //       setVictoriesTable(reordered);
  //       setIsEditing(false);


  //       // Remove from localStorage
  //       localStorage.removeItem('VictoriesTableData');

  //     }
  //   }, 1000);
  // };
  

  const handleSaveChanges = async () => {
    setLoadingSave(true);
  
    setTimeout(async () => {
      setLoadingSave(false);
  
      const storedData = localStorage.getItem('VictoriesTableData');

      let reordered;
  
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          ENABLE_CONSOLE_LOGS && console.log('Saved Victories Table after Save Changes Button:', parsedData);
  
          reordered = parsedData.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
  
          ENABLE_CONSOLE_LOGS && console.log('Saved Victories Table (Reindexed):', reordered);
  
          setVictoriesTable(reordered);
          setIsEditing(false);
          localStorage.removeItem('VictoriesTableData');
        } catch (err) {
          ENABLE_CONSOLE_LOGS && console.error('Error parsing VictoriesTableData on save:', err);
          return;
        }
      } else {
        reordered = currentOrder.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
  
        ENABLE_CONSOLE_LOGS && console.log('Saved Victories Table (Reordered):', reordered);
  
        setVictoriesTable(reordered);
        setIsEditing(false);
        localStorage.removeItem('VictoriesTableData');
      }
  
      try {
        // 1. Get CSRF token
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
  
        const { csrf_token } = await csrfRes.json();
  
        // 2. Update data
        const response = await fetch(`${API_URL}/v1/tools/victories/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organization,
            toolsVictoriesData: reordered,
          }),
        });
  
        const result = await response.json();
  
        ENABLE_CONSOLE_LOGS && console.log('📝 Tools Victories Update Response:', result);
  
        if (!response.ok) {
          console.error('Update failed:', result.message || 'Unknown error');
        }
      } catch (error) {
        console.error('❌ Tools Victories update request error:', error);
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
    localStorage.removeItem('VictoriesTableData');

    // 2. Clear edited state (hides buttons)
    setIsEditing(false);

    // 3. Update Zustand store
    setVictoriesTable(initialVictories);

    // 4. refresh the table
    setCurrentOrder(victoriesTable);

    // 5. Hide Modal
    setShowConfirmModal(false);

  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };


  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(victoriesTable);
  }, [victoriesTable]);

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
    localStorage.setItem('VictoriesTableData', JSON.stringify(currentOrder));
  
    // Also flag changes for Save/Discharge buttons
    setIsEditing(true);

  
    ENABLE_CONSOLE_LOGS && console.log('Drag ended and saved to localStorage:', currentOrder);
  };

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setVictoriesTable(currentOrder);
    setIsEditing(false);

  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('VictoriesTableData');
    setShowConfirmModal(false);
    setCurrentOrder(victoriesTable);
    setIsEditing(false);
  };

  const isSkeleton = victoriesTable.some(driver => 
    driver.description === '-' &&
    driver.status === '-'
  );

  const handleDeleteDriver = (id) => {
    const updated = victoriesTable.filter(driver => driver.id !== id);
    setVictoriesTable(updated);
    localStorage.setItem('VictoriesTableData', JSON.stringify(updated));
  
    // Mark as edited
    setIsEditing(true);

  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Victories</h5>
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
                  Add Victory
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
              <th className="border px-4 py-2 ">Milestones</th>
              <th className="border px-4 py-2 ">Notes</th>
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
                  driver.milestones !== '-' &&
                  driver.notes !== '-' 
                }
                onDragStart={
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.milestones !== '-' &&
                  driver.notes !== '-' 
                    ? (e) => handleDragStart(e, driver.id)
                    : undefined
                }
                onDragOver={
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.milestones !== '-' &&
                  driver.notes !== '-' 
                    ? (e) => handleDragOver(e, driver.id)
                    : undefined
                }
                onDragEnd={
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.milestones !== '-' &&
                  driver.notes !== '-' 
                    ? handleDragEnd
                    : undefined
                }
                className={`hover:bg-gray-50 ${
                  loggedUser?.role === 'superadmin' &&
                  driver.date !== '-' &&
                  driver.who !== '-' &&
                  driver.milestones !== '-' &&
                  driver.notes !== '-' 
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

                {/* milestones */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.milestones !== '-' && handleCellClick(driver.id, 'milestones')}
                >
                  {driver.milestones === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'milestones' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.milestones}
                      onBlur={(e) => handleInputBlur(driver.id, 'milestones', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.milestones
                  )}
                </td>

                {/* notes */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.notes !== '-' && handleCellClick(driver.id, 'notes')}
                >
                  {driver.notes === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'notes' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.notes}
                      onBlur={(e) => handleInputBlur(driver.id, 'notes', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.notes
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
            <div className="modal-add-title">Add Victory</div>


            <label className="modal-add-label">Date</label>
            <input
              type="date"
              className="modal-add-input"
              value={newVictoriesTable.date}
              onChange={(e) =>
                setNewVictoriesTable({ ...newVictoriesTable, date: e.target.value })
              }
            />


            <label className="modal-add-label">Who</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newVictoriesTable.who}
              onChange={(e) => setNewVictoriesTable({ ...newVictoriesTable, who: e.target.value })}
            />

            <label className="modal-add-label">Milestones</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newVictoriesTable.milestones}
              onChange={(e) => setNewVictoriesTable({ ...newVictoriesTable, milestones: e.target.value })}
            />

            <label className="modal-add-label">Notes</label>
            <textarea
              className="modal-add-input"
              rows="2"
              value={newVictoriesTable.notes}
              onChange={(e) => setNewVictoriesTable({ ...newVictoriesTable, notes: e.target.value })}
            />

            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAddNewVictoriesTable}>Add</button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default VictoriesTable;
