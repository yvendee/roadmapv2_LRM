// frontend\src\components\13a.issues\1.IssueTable\IssueTable.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import useAnnualPrioritiesStore, { initialAnnualPriorities } from '../../../store/left-lower-content/13.tools/1.issuesStore';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './IssueTable.css';

const IssueTable = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });

  const loggedUser = useLoginStore((state) => state.user);
  const annualPriorities = useAnnualPrioritiesStore((state) => state.annualPriorities);
  const setAnnualPriorities = useAnnualPrioritiesStore((state) => state.setAnnualPriorities);
  const updateAnnualPrioritiesField = useAnnualPrioritiesStore((state) => state.updateAnnualPrioritiesField);
  const pushAnnualPriorities = useAnnualPrioritiesStore((state) => state.pushAnnualPriorities);

  // const [editedAnnualPriorities, setEditedAnnualPriorities] = useState([]);
  

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnnualPriority, setNewAnnualPriority] = useState({
    description: '',
    status: 'Tracking',
  });

  const [currentOrder, setCurrentOrder] = useState(annualPriorities);
  const [draggedId, setDraggedId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  
  
  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('annualPrioritiesData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setAnnualPriorities(parsedData);

        ENABLE_CONSOLE_LOGS && console.log('annualPrioritiesData found! and  loaded!');


        // ✅ Treat this as unsaved state, trigger the buttons
        // setEditedAnnualPriorities(parsedData.map((d) => ({ id: d.id })));
        setIsEditing(true);


      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Failed to parse annualPrioritiesData from localStorage:', err);
      }
    }
  }, [setAnnualPriorities]);

  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add Annual Priorities button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  const handleAddNewAnnualPriority = () => {
    ENABLE_CONSOLE_LOGS && console.log('New Annual Priority:', JSON.stringify(newAnnualPriority, null, 2));

    // 2. Hide Save / Discharge
    // setEditedAnnualPriorities([]);
    setIsEditing(false);

  
    // 3. Remove localStorage temp data
    localStorage.removeItem('annualPrioritiesData');
  
    // 4. Push to Zustand store
    pushAnnualPriorities(newAnnualPriority);
  
    // 5. Optionally: force-refresh the UI by resetting store (if needed)
    // Not required unless you deep reset from localStorage elsewhere
  
    // Close modal
    setShowAddModal(false);
  
    // Reset form input
    setNewAnnualPriority({ description: '', status: 'Tracking' });
  };

  const handleCellClick = (id, field) => {
    if (loggedUser?.role === 'superadmin') {
      setEditingCell({ id, field });
    }
  };

  const handleInputBlur = (id, field, value) => {
    updateAnnualPrioritiesField(id, field, value);

    // Update local state for Save/Discharge buttons
    setIsEditing(true);

    // setEditedAnnualPriorities((prev) => {
    //   const existing = prev.find((d) => d.id === id);
    //   if (existing) {
    //     return prev.map((d) =>
    //       d.id === id ? { ...d, [field]: value } : d
    //     );
    //   }
    //   return [...prev, { id, [field]: value }];
    // });

    // Update localStorage
    const updatedDrivers = annualPriorities.map((driver) =>
      driver.id === id ? { ...driver, [field]: value } : driver
    );
    localStorage.setItem('annualPrioritiesData', JSON.stringify(updatedDrivers));

    setEditingCell({ id: null, field: null });
  };


  
  const handleSaveChanges = () => {

    setLoadingSave(true);
  
    setTimeout(() => {
      setLoadingSave(false);
  
      const storedData = localStorage.getItem('annualPrioritiesData');
  
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
  
          // 1. Log to console
          ENABLE_CONSOLE_LOGS && console.log('Saved Annual Priorities after Save Changes Button:', parsedData);
  
          // 2. Update Zustand store
          setAnnualPriorities(parsedData);

          // Reindex IDs
          const reordered = parsedData.map((driver, index) => ({
            ...driver,
            id: index + 1,
          }));

          ENABLE_CONSOLE_LOGS &&  console.log('Saved Annual Priorities (Reindexed):', reordered);

          setAnnualPriorities(reordered);
  
          // 3. Clear edited state (hides buttons)
          // setEditedAnnualPriorities([]);
          setIsEditing(false);

  
          // 4. Remove from localStorage
          localStorage.removeItem('annualPrioritiesData');
        } catch (err) {
          ENABLE_CONSOLE_LOGS && console.error('Error parsing annualPrioritiesData on save:', err);
        }
      } else {

        // No localStorage changes, use current drag order

        const reordered = currentOrder.map((driver, index) => ({
          ...driver,
          id: index + 1,
        }));

        ENABLE_CONSOLE_LOGS &&  console.log('Saved Annual Priorities (reordered):', reordered);
        setAnnualPriorities(reordered);
        // setEditedAnnualPriorities([]);
        setIsEditing(false);


        // Remove from localStorage
        localStorage.removeItem('annualPrioritiesData');

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
    localStorage.removeItem('annualPrioritiesData');

    // 2. Clear edited state (hides buttons)
    // setEditedAnnualPriorities([]);
    setIsEditing(false);


    // 3. Update Zustand store
    setAnnualPriorities(initialAnnualPriorities);

    // 4. Hide Modal
    setShowConfirmModal(false);
  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };


  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(annualPriorities);
  }, [annualPriorities]);

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
    // setEditedAnnualPriorities(prev => prev.find(d=>d.id===draggedId) ? prev : [...prev, { id: draggedId }]);
    setIsEditing(true);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  
    // Save the new drag order to localStorage
    localStorage.setItem('annualPrioritiesData', JSON.stringify(currentOrder));
  
    // Also flag changes for Save/Discharge buttons
    // setEditedAnnualPriorities(currentOrder.map(d => ({ id: d.id })));
    setIsEditing(true);

  
    ENABLE_CONSOLE_LOGS && console.log('Drag ended and saved to localStorage:', currentOrder);
  };

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setAnnualPriorities(currentOrder);
    // setEditedAnnualPriorities([]);
    setIsEditing(false);

  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('annualPrioritiesData');
    setShowConfirmModal(false);
    setCurrentOrder(annualPriorities);
    // setEditedAnnualPriorities([]);
    setIsEditing(false);

  };

  const isSkeleton = annualPriorities.some(driver => 
    driver.description === '-' &&
    driver.status === '-'
  );

  const handleDeleteDriver = (id) => {
    const updated = annualPriorities.filter(driver => driver.id !== id);
    setAnnualPriorities(updated);
    localStorage.setItem('annualPrioritiesData', JSON.stringify(updated));
  
    // Mark as edited
    // setEditedAnnualPriorities(prev => [...prev, { id }]);
    setIsEditing(true);

  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Issues</h5>
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
                  Add Issues
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
              <th className="border px-4 py-2 ">Issue</th>
              <th className="border px-4 py-2 ">Description</th>
              <th className="border px-4 py-2 ">Date Logged</th>
              <th className="border px-4 py-2 ">Who</th>
              <th className="border px-4 py-2 ">Resolution</th>
              <th className="border px-4 py-2 ">Date Resolved</th>
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
                  driver.issueName !== '-' &&
                  driver.description !== '-' &&
                  driver.dateLogged !== '-' &&
                  driver.who !== '-' &&
                  driver.resolution !== '-' &&
                  driver.dateResolved !== '-' &&
                  driver.status !== '-'
                  
                }
                onDragStart={
                  loggedUser?.role === 'superadmin' &&
                  driver.issueName !== '-' &&
                  driver.description !== '-' &&
                  driver.dateLogged !== '-' &&
                  driver.who !== '-' &&
                  driver.resolution !== '-' &&
                  driver.dateResolved !== '-' &&
                  driver.status !== '-'
                    ? (e) => handleDragStart(e, driver.id)
                    : undefined
                }
                onDragOver={
                  loggedUser?.role === 'superadmin' &&
                  driver.issueName !== '-' &&
                  driver.description !== '-' &&
                  driver.dateLogged !== '-' &&
                  driver.who !== '-' &&
                  driver.resolution !== '-' &&
                  driver.dateResolved !== '-' &&
                  driver.status !== '-'
                    ? (e) => handleDragOver(e, driver.id)
                    : undefined
                }
                onDragEnd={
                  loggedUser?.role === 'superadmin' &&
                  driver.issueName !== '-' &&
                  driver.description !== '-' &&
                  driver.dateLogged !== '-' &&
                  driver.who !== '-' &&
                  driver.resolution !== '-' &&
                  driver.dateResolved !== '-' &&
                  driver.status !== '-'
                    ? handleDragEnd
                    : undefined
                }
                className={`hover:bg-gray-50 ${
                  loggedUser?.role === 'superadmin' &&
                  driver.issueName !== '-' &&
                  driver.description !== '-' &&
                  driver.dateLogged !== '-' &&
                  driver.who !== '-' &&
                  driver.resolution !== '-' &&
                  driver.dateResolved !== '-' &&
                  driver.status !== '-'
                    ? 'cursor-move'
                    : 'cursor-default'
                }`}
              >

                {/* Implement skeleton  Loading */}
                
                {/* id */}
                <td className="border px-4 py-3">{isSkeleton ? <div className="skeleton w-6"></div> : driver.id}</td>

                {/* issue name*/}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.issueName !== '-' && handleCellClick(driver.id, 'issueName')}
                >
                  {driver.issueName === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'issueName' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.issueName}
                      onBlur={(e) => handleInputBlur(driver.id, 'issueName', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.issueName
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

                {/* dateLogged */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.dateLogged !== '-' && handleCellClick(driver.id, 'dateLogged')}
                >
                  {driver.dateLogged === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'dateLogged' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.dateLogged}
                      onBlur={(e) => handleInputBlur(driver.id, 'dateLogged', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.dateLogged
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

                {/* resolution */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.resolution !== '-' && handleCellClick(driver.id, 'resolution')}
                >
                  {driver.resolution === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'resolution' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.resolution}
                      onBlur={(e) => handleInputBlur(driver.id, 'resolution', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.resolution
                  )}
                </td>


                {/* date resolved */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.dateResolved !== '-' && handleCellClick(driver.id, 'dateResolved')}
                >
                  {driver.dateResolved === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'dateResolved' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.dateResolved}
                      onBlur={(e) => handleInputBlur(driver.id, 'dateResolved', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.dateResolved
                  )}
                </td>

                {/* status */}
                {/* <td>
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
                </td> */}
                
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
            <div className="modal-add-title">Issues</div>

            <label className="modal-add-label">Issue Name</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newAnnualPriority.issueName}
              onChange={(e) => setNewAnnualPriority({ ...newAnnualPriority, issueName: e.target.value })}
            />

            <label className="modal-add-label">Description</label>
            <textarea
              className="modal-add-input"
              rows="2"
              value={newAnnualPriority.description}
              onChange={(e) => setNewAnnualPriority({ ...newAnnualPriority, description: e.target.value })}
            />

            <label className="modal-add-label">Date Logged</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newAnnualPriority.dateLogged}
              onChange={(e) => setNewAnnualPriority({ ...newAnnualPriority, dateLogged: e.target.value })}
            />


            <label className="modal-add-label">Who</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newAnnualPriority.who}
              onChange={(e) => setNewAnnualPriority({ ...newAnnualPriority, who: e.target.value })}
            />


            <label className="modal-add-label">Resolution</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newAnnualPriority.resolution}
              onChange={(e) => setNewAnnualPriority({ ...newAnnualPriority, resolution: e.target.value })}
            />


            <label className="modal-add-label">Date Resolved</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newAnnualPriority.dateResolved}
              onChange={(e) => setNewAnnualPriority({ ...newAnnualPriority, dateResolved: e.target.value })}
            />



            {/* <label className="modal-add-label">Status</label>
            <select
              className="modal-add-select"
              value={newAnnualPriority.status}
              onChange={(e) => setNewAnnualPriority({ ...newAnnualPriority, status: e.target.value })}
            >
              <option>100.00%</option>
              <option>83.33%</option>
              <option>0.00%</option>
              <option>50.00%</option>
            </select> */}

            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAddNewAnnualPriority}>Add</button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default IssueTable;
