// frontend\src\components\13a.issues\1.IssueTable\IssueTable.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import useIssuesStore, { initialIssues } from '../../../store/left-lower-content/13.tools/1.issuesStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './IssueTable.css';

const IssueTable = () => {
  const organization = useLayoutSettingsStore.getState().organization;
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });

  const loggedUser = useLoginStore((state) => state.user);
  const issuesTable = useIssuesStore((state) => state.issuesTable);
  const setIssuesTable = useIssuesStore((state) => state.setIssuesTable);
  const updateIssuesTableField = useIssuesStore((state) => state.updateIssuesTableField);
  const pushIssuesTable = useIssuesStore((state) => state.pushIssuesTable);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newIssuesTable, setNewIssuesTable] = useState({
    issueName: '',
    description: '',
    dateLogged: '',
    who: '',
    resolution: '',
    dateResolved: '',
  });

  const [currentOrder, setCurrentOrder] = useState(issuesTable);
  const [draggedId, setDraggedId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('IssueTableData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setIssuesTable(parsedData);

        ENABLE_CONSOLE_LOGS && console.log('IssueTableData found! and  loaded!');


        // ✅ Treat this as unsaved state, trigger the buttons
        setIsEditing(true);


      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Failed to parse IssueTableData from localStorage:', err);
      }
    }
  }, [setIssuesTable]);

  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(issuesTable);
  }, [issuesTable]);

  
  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add Annual Priorities button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  // const handleAddNewIssuesTable = () => {
  //   ENABLE_CONSOLE_LOGS && console.log('New Issues Table', JSON.stringify(newIssuesTable, null, 2));

  //   // 2. Hide Save / Discharge
  //   setIsEditing(false);

  
  //   // 3. Remove localStorage temp data
  //   localStorage.removeItem('IssueTableData');
  
  //   // 4. Push to Zustand store
  //   pushIssuesTable(newIssuesTable);
  
  //   // 5. Optionally: force-refresh the UI by resetting store (if needed)
  //   // Not required unless you deep reset from localStorage elsewhere
  
  //   // Close modal
  //   setShowAddModal(false);
  
  //   // Reset form input
  //   setNewIssuesTable({     
  //     issueName: '',
  //     description: '',
  //     dateLogged: '',
  //     who: '',
  //     resolution: '',
  //     dateResolved: '', 
  //   });
  // };


  const handleAddNewIssuesTable = async () => {
    ENABLE_CONSOLE_LOGS && console.log('New Issues Table', JSON.stringify(newIssuesTable, null, 2));
  
    try {
      // Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      // Send POST request to Laravel to add the new issue
      const response = await fetch(`${API_URL}/v1/tools/issues/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include', // Required for Laravel session
        body: JSON.stringify({
          organization, // From Zustand store
          issue: newIssuesTable,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('❌ Failed to insert new issue:', result.message || 'Unknown error');
        return;
      }
  
      ENABLE_CONSOLE_LOGS && console.log('✅ New issue added successfully:', result);
  
      // Push returned item to Zustand store (with new ID)
      pushIssuesTable(result.newItem);
  
      // Cleanup UI state
      setIsEditing(false);
      localStorage.removeItem('IssueTableData');
      setShowAddModal(false);
  
      // Reset form inputs
      setNewIssuesTable({
        issueName: '',
        description: '',
        dateLogged: '',
        who: '',
        resolution: '',
        dateResolved: '',
      });
  
    } catch (error) {
      console.error('❌ Error inserting new issue:', error);
    }
  };
  
  const handleCellClick = (id, field) => {
    if (loggedUser?.role === 'superadmin') {
      setEditingCell({ id, field });
    }
  };

  const handleInputBlur = (id, field, value) => {
    updateIssuesTableField(id, field, value);

    // Update local state for Save/Discharge buttons
    setIsEditing(true);

    // Update localStorage
    const updatedDrivers = issuesTable.map((driver) =>
      driver.id === id ? { ...driver, [field]: value } : driver
    );
    localStorage.setItem('IssueTableData', JSON.stringify(updatedDrivers));

    setEditingCell({ id: null, field: null });
  };


  const handleSaveChanges = async () => {
    setLoadingSave(true);
  
    setTimeout(async () => {
      setLoadingSave(false);
  
      const storedData = localStorage.getItem('IssueTableData');
  
      let dataToSend;
  
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          ENABLE_CONSOLE_LOGS && console.log('Saved Issues Table after Save Changes Button:', parsedData);
  
          // Reindex
          dataToSend = parsedData.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
  
          ENABLE_CONSOLE_LOGS && console.log('Saved Issues Table (Reindexed):', dataToSend);
          setIssuesTable(dataToSend);
          localStorage.removeItem('IssueTableData');
          setIsEditing(false);
        } catch (err) {
          ENABLE_CONSOLE_LOGS && console.error('Error parsing IssueTableData on save:', err);
          return;
        }
      } else {
        // No localStorage changes, use current drag order
        dataToSend = currentOrder.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
  
        ENABLE_CONSOLE_LOGS && console.log('Saved Issues Table (reordered):', dataToSend);
        setIssuesTable(dataToSend);
        localStorage.removeItem('IssueTableData');
        setIsEditing(false);
      }
  
      try {
        // Step 1: Get CSRF token
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
        const { csrf_token } = await csrfRes.json();
  
        // Step 2: Send updated data to backend
        const response = await fetch(`${API_URL}/v1/tools/issues/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organization,
            toolsIssuesData: dataToSend,
          }),
        });
  
        const result = await response.json();
        ENABLE_CONSOLE_LOGS && console.log('📝 Tools Issues Update response:', result);
  
        if (!response.ok) {
          console.error('Tools Issues update failed:', result.message || 'Unknown error');
        }
      } catch (error) {
        console.error('❌ Tools Issues update request failed:', error);
      }
    }, 1000);
  };
  
  
  // const handleSaveChanges = () => {

  //   setLoadingSave(true);
  
  //   setTimeout(() => {
  //     setLoadingSave(false);
  
  //     const storedData = localStorage.getItem('IssueTableData');
  
  //     if (storedData) {
  //       try {
  //         const parsedData = JSON.parse(storedData);
  
  //         // 1. Log to console
  //         ENABLE_CONSOLE_LOGS && console.log('Saved Issues Table after Save Changes Button:', parsedData);
  
  //         // 2. Update Zustand store
  //         setIssuesTable(parsedData);

  //         // Reindex IDs
  //         const reordered = parsedData.map((driver, index) => ({
  //           ...driver,
  //           id: index + 1,
  //         }));

  //         ENABLE_CONSOLE_LOGS &&  console.log('Saved Issues Table (Reindexed):', reordered);

  //         setIssuesTable(reordered);
  
  //         // 3. Clear edited state (hides buttons)
  //         setIsEditing(false);

  
  //         // 4. Remove from localStorage
  //         localStorage.removeItem('IssueTableData');
  //       } catch (err) {
  //         ENABLE_CONSOLE_LOGS && console.error('Error parsing IssueTableData on save:', err);
  //       }
  //     } else {

  //       // No localStorage changes, use current drag order

  //       const reordered = currentOrder.map((driver, index) => ({
  //         ...driver,
  //         id: index + 1,
  //       }));

  //       ENABLE_CONSOLE_LOGS &&  console.log('Saved Issues Table (reordered):', reordered);
  //       setIssuesTable(reordered);
  //       setIsEditing(false);


  //       // Remove from localStorage
  //       localStorage.removeItem('IssueTableData');

  //     }
  //   }, 1000);
  // };
  
  const handleDischargeChanges = () => {
    setLoadingDischarge(true);
    setTimeout(() => {
      setLoadingDischarge(false);
      setShowConfirmModal(true);
    }, 1000);
  };

  const confirmDischargeChanges = () => {
    // 1. Remove from localStorage
    localStorage.removeItem('IssueTableData');

    // 2. Clear edited state (hides buttons)
    setIsEditing(false);

    // 3. Update Zustand store
    // setIssuesTable(initialIssues);
    const { baselineIssuesTable } = useIssuesStore.getState();

    // ✅ Console log to inspect baselineIssuesTable before setting
    ENABLE_CONSOLE_LOGS &&  console.log('💾 Restoring baselineIssueTable:', baselineIssuesTable);

    setIssueTable(baselineIssuesTable);


    // 4. refresh the table
    setCurrentOrder(baselineIssuesTable);

    // 5. Hide Modal
    setShowConfirmModal(false);

    // localStorage.removeItem('IssueTableData');
    // setShowConfirmModal(false);
    // setCurrentOrder(issuesTable);
    // setIsEditing(false);
  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };


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
    localStorage.setItem('IssueTableData', JSON.stringify(currentOrder));
  
    // Also flag changes for Save/Discharge buttons
    setIsEditing(true);

  
    ENABLE_CONSOLE_LOGS && console.log('Drag ended and saved to localStorage:', currentOrder);
  };

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setIssuesTable(currentOrder);
    setIsEditing(false);

  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('IssueTableData');
    setShowConfirmModal(false);
    setCurrentOrder(issuesTable);
    setIsEditing(false);
  };

  const isSkeleton = issuesTable.some(driver => 
    driver.description === '-' &&
    driver.status === '-'
  );

  const handleDeleteDriver = (id) => {
    const updated = issuesTable.filter(driver => driver.id !== id);
    setIssuesTable(updated);
    localStorage.setItem('IssueTableData', JSON.stringify(updated));
  
    // Mark as edited
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
                    // <textarea
                    //   autoFocus
                    //   defaultValue={driver.dateLogged}
                    //   onBlur={(e) => handleInputBlur(driver.id, 'dateLogged', e.target.value)}
                    //   className="w-full px-2 py-1 border rounded resize-none"
                    //   rows={3}
                    // />

                    <input
                      type="date"
                      autoFocus
                      defaultValue={driver.dateLogged} // ensure it's in YYYY-MM-DD format
                      onBlur={(e) => handleInputBlur(driver.id, 'dateLogged', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
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
                    // <textarea
                    //   autoFocus
                    //   defaultValue={driver.dateResolved}
                    //   onBlur={(e) => handleInputBlur(driver.id, 'dateResolved', e.target.value)}
                    //   className="w-full px-2 py-1 border rounded resize-none"
                    //   rows={3}
                    // />

                    <input
                      type="date"
                      autoFocus
                      defaultValue={driver.dateResolved} // ensure it's in YYYY-MM-DD format
                      onBlur={(e) => handleInputBlur(driver.id, 'dateResolved', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
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
            <div className="modal-add-title">Add Issue</div>

            <label className="modal-add-label">Issue Name</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newIssuesTable.issueName}
              onChange={(e) => setNewIssuesTable({ ...newIssuesTable, issueName: e.target.value })}
            />

            <label className="modal-add-label">Description</label>
            <textarea
              className="modal-add-input"
              rows="2"
              value={newIssuesTable.description}
              onChange={(e) => setNewIssuesTable({ ...newIssuesTable, description: e.target.value })}
            />

            <label className="modal-add-label">Date Logged</label>
            <input
              type="date"
              className="modal-add-input"
              value={newIssuesTable.dateLogged}
              onChange={(e) =>
                setNewIssuesTable({ ...newIssuesTable, dateLogged: e.target.value })
              }
            />


            <label className="modal-add-label">Who</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newIssuesTable.who}
              onChange={(e) => setNewIssuesTable({ ...newIssuesTable, who: e.target.value })}
            />


            <label className="modal-add-label">Resolution</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newIssuesTable.resolution}
              onChange={(e) => setNewIssuesTable({ ...newIssuesTable, resolution: e.target.value })}
            />


            <label className="modal-add-label">Date Resolved</label>
            <input
              type="date"
              className="modal-add-input"
              value={newIssuesTable.dateResolved}
              onChange={(e) =>
                setNewIssuesTable({ ...newIssuesTable, dateResolved: e.target.value })
              }
            />

            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAddNewIssuesTable}>Add</button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default IssueTable;
