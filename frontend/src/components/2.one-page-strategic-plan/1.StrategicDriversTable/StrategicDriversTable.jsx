// frontend\src\components\one-page-strategic-plan\1.StrategicDriversTable\StrategicDriversTable.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import useStrategicDriversStore, { initialStrategicDrivers } from '../../../store/left-lower-content/2.one-page-strategic-plan/1.strategicDriversStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './StrategicDriversTable.css';

const StrategicDriversTable = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });
  const organization = useLayoutSettingsStore((state) => state.organization);



  const loggedUser = useLoginStore((state) => state.user);
  // const strategicDrivers = useStrategicDriversStore((state) => state.strategicDrivers);
  // const setStrategicDrivers = useStrategicDriversStore((state) => state.setStrategicDrivers);
  const storeDrivers = useStrategicDriversStore((state) => state.strategicDrivers);
  const [strategicDrivers, setStrategicDrivers] = useState([]);
  const updateDriverField = useStrategicDriversStore((state) => state.updateDriverField);
  const pushStrategicDriver = useStrategicDriversStore((state) => state.pushStrategicDriver);

  const [editedDrivers, setEditedDrivers] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    title: '',
    description: '',
    kpi: '',
    status: 'Tracking',
  });

  const [currentOrder, setCurrentOrder] = useState(strategicDrivers);
  const [draggedId, setDraggedId] = useState(null);
  
  

  // Load from localStorage if available
  // useEffect(() => {
  //   const storedData = localStorage.getItem('strategicDriversData');
  //   if (storedData) {
  //     try {
  //       const parsedData = JSON.parse(storedData);
  //       setStrategicDrivers(parsedData);

  //       // ✅ Treat this as unsaved state, trigger the buttons
  //       setEditedDrivers(parsedData.map((d) => ({ id: d.id })));

  //     } catch (err) {
  //       ENABLE_CONSOLE_LOGS && console.error('Failed to parse strategicDriversData from localStorage:', err);
  //     }
  //   }
  // }, [setStrategicDrivers]);


  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(strategicDrivers);
  }, [strategicDrivers]);

  useEffect(() => {
    const stored = localStorage.getItem('strategicDriversData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStrategicDrivers(parsed);
        setEditedDrivers(parsed.map((d) => ({ id: d.id })));
      } catch (err) {
        console.error('Error parsing strategicDriversData:', err);
      }
    }
    else {
      // ✅ fallback if nothing in localStorage
      setStrategicDrivers(storeDrivers); // fallback to store if no localStorage
      setCurrentOrder(storeDrivers);
    }
  }, [storeDrivers]);

  const confirmDischargeChanges = () => {
    localStorage.removeItem('strategicDriversData');
    setEditedDrivers([]);
  
    const currentState = useStrategicDriversStore.getState().strategicDrivers;
    setStrategicDrivers(currentState); // rollback to store state
    setCurrentOrder(currentState);
  
    setShowConfirmModal(false);
  };
  
  
  const handleInputBlur = (id, field, value) => {
    const updated = strategicDrivers.map((driver) =>
      driver.id === id ? { ...driver, [field]: value } : driver
    );
  
    setStrategicDrivers(updated);
    localStorage.setItem('strategicDriversData', JSON.stringify(updated));
  
    if (!editedDrivers.some((d) => d.id === id)) {
      setEditedDrivers([...editedDrivers, { id }]);
    }
  
    setEditingCell({ id: null, field: null });
  };


  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // console.log('Add Strategic Drivers button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  const handleAddNewDriver = async () => {

    const driverToAdd = {
      title: newDriver.title?.trim() || 'Untitled Driver',
      description: newDriver.description?.trim() || 'No description',
      kpi: newDriver.kpi?.trim() || 'N/A',
      status: newDriver.status || 'Tracking',
    };

    ENABLE_CONSOLE_LOGS && console.log('New Driver:', JSON.stringify(driverToAdd, null, 2));
  
    const currentDrivers = useStrategicDriversStore.getState().strategicDrivers;
  
    // Append new driver to the current list
    const updated = [...currentDrivers, driverToAdd];
  
    // Reindex with new IDs
    const reordered = updated.map((driver, index) => ({
      ...driver,
      id: index + 1,
    }));
  
    ENABLE_CONSOLE_LOGS && console.log('🚀 Updated + Reindexed StrategicDrivers:', reordered);
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const org = useLayoutSettingsStore.getState().organization;
  
      // 🔁 Use the updated /update endpoint
      const response = await fetch(`${API_URL}/v1/one-page-strategic-plan/strategic-drivers/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization: org,
          strategicDriversData: reordered,
        }),
      });
  
      const data = await response.json();
      ENABLE_CONSOLE_LOGS && console.log('✅ Update Driver API Response:', data);
  
      if (response.ok && data.status === 'success') {
        setStrategicDrivers(reordered); // Update Zustand store
        setCurrentOrder(reordered); // update UI
        
      } else {
        console.error('❌ Failed to update drivers:', data.message);
      }
  
    } catch (error) {
      console.error('❌ Error updating strategic drivers:', error);
    }
  
    // Final cleanup
    setEditedDrivers([]);
    localStorage.removeItem('strategicDriversData');
    setShowAddModal(false);
    setNewDriver({ title: '', description: '', kpi: '', status: 'Tracking' });
  };
  
  const handleCellClick = (id, field) => {
    // if (loggedUser?.role === 'superadmin') {
    //   setEditingCell({ id, field });
    // }
    const position = loggedUser?.position;
    const canEdit = 
      loggedUser?.role === 'superadmin' || 
      ['Admin', 'CEO', 'Internal'].includes(position);
  
    if (canEdit) {
      setEditingCell({ id, field });
    }
  };


  
  const handleSaveChanges = () => {

    setLoadingSave(true);
  
    setTimeout(async () => {
      setLoadingSave(false);
  
      const storedData = localStorage.getItem('strategicDriversData');
  
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
  
          // 1. Log to console
          ENABLE_CONSOLE_LOGS && console.log('Saved strategic drivers after Save Changes Button:', parsedData);
  
          // 2. Update Zustand store
          setStrategicDrivers(parsedData);

          // Reindex IDs
          const reordered = parsedData.map((driver, index) => ({
            ...driver,
            id: index + 1,
          }));

          ENABLE_CONSOLE_LOGS &&  console.log('Saved strategic drivers (Reindexed):', reordered);

          setStrategicDrivers(reordered);
  
          // 3. Clear edited state (hides buttons)
          setEditedDrivers([]);
  
          // 4. Remove from localStorage
          localStorage.removeItem('strategicDriversData');
          

          // Now update backend with Reindexed data
          try {
            const csrfRes = await fetch(`${API_URL}/csrf-token`, {
              credentials: 'include',
            });
            const { csrf_token } = await csrfRes.json();

            const response = await fetch(`${API_URL}/v1/one-page-strategic-plan/strategic-drivers/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf_token,
              },
              credentials: 'include',
              body: JSON.stringify({
                organization,
                strategicDriversData: reordered,
              }),
            });

            const data = await response.json();
            ENABLE_CONSOLE_LOGS && console.log('Update strategic drivers response:', data);

            if (!response.ok) {
              console.error('Failed to update strategic drivers:', data.message || 'Unknown error');
            }
          } catch (error) {
            console.error('Error updating strategic drivers:', error);
          }

        } catch (err) {
          ENABLE_CONSOLE_LOGS && console.error('Error parsing strategicDriversData on save:', err);
        }
      } else {

        // No localStorage changes, use current drag order

        const reordered = currentOrder.map((driver, index) => ({
          ...driver,
          id: index + 1,
        }));

        ENABLE_CONSOLE_LOGS &&  console.log('Saved strategic drivers (reordered):', reordered);
        setStrategicDrivers(reordered);
        setEditedDrivers([]);

        // Remove from localStorage
        localStorage.removeItem('strategicDriversData');


        // Now update backend with reordered data
        try {
          const csrfRes = await fetch(`${API_URL}/csrf-token`, {
            credentials: 'include',
          });
          const { csrf_token } = await csrfRes.json();

          const response = await fetch(`${API_URL}/v1/one-page-strategic-plan/strategic-drivers/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrf_token,
            },
            credentials: 'include',
            body: JSON.stringify({
              organization,
              strategicDriversData: reordered,
            }),
          });

          const data = await response.json();
          ENABLE_CONSOLE_LOGS && console.log('Update strategic drivers response:', data);

          if (!response.ok) {
            console.error('Failed to update strategic drivers:', data.message || 'Unknown error');
          }
        } catch (error) {
          console.error('Error updating strategic drivers:', error);
        }

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
    // localStorage.setItem('strategicDriversData', JSON.stringify(newOrder));
    setEditedDrivers(prev => prev.find(d=>d.id===draggedId) ? prev : [...prev, { id: draggedId }]);
  };

  // const handleDragEnd = () => {
  //   setDraggedId(null);
  // };

  const handleDragEnd = () => {
    setDraggedId(null);
  
    // ✅ Save drag result to localStorage
    localStorage.setItem('strategicDriversData', JSON.stringify(currentOrder));
  
    // ✅ Optionally mark all drivers as edited (or just draggedId if you prefer)
    const editedIds = currentOrder.map((d) => ({ id: d.id }));
    setEditedDrivers(editedIds);
  };
  

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setStrategicDrivers(currentOrder);
    setEditedDrivers([]);
  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('strategicDriversData');
    setShowConfirmModal(false);
    setCurrentOrder(strategicDrivers);
    setEditedDrivers([]);
  };

  const isSkeleton = strategicDrivers.some(driver => 
    driver.title === '-' && 
    driver.description === '-' &&
    driver.kpi === '-' &&
    driver.status === '-'
  );

  const handleDeleteDriver = (id) => {
    const updated = strategicDrivers.filter(driver => driver.id !== id);
    setStrategicDrivers(updated);
    localStorage.setItem('strategicDriversData', JSON.stringify(updated));
  
    // Mark as edited
    setEditedDrivers(prev => [...prev, { id }]);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Strategic Drivers</h5>
        {/* {loggedUser?.role === 'superadmin' && ( */}
        {(['superadmin'].includes(loggedUser?.role) || 
          ['Admin', 'CEO', 'Internal'].includes(loggedUser?.position)) && (
          <div className="flex gap-2">
            {editedDrivers.length > 0 && (
              <>
                <button className="pure-green-btn print:hidden" onClick={handleSaveChanges}>
                {loadingSave ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  ) : (
                    <>
                    <FontAwesomeIcon icon={faSave} className="mr-1" />
                    Save Changes
                    </>
                )}
                </button>
                <button className="pure-red-btn print:hidden" onClick={handleDischargeChanges}>
                  {loadingDischarge ? (
                    <div className="loader-bars">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    ) : (
                      <>
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                      Discard
                      </>
                  )}
                </button>
              </>
            )}

            {/* {loggedUser?.role === 'superadmin' && !isSkeleton && ( */}
            {(
            loggedUser?.role === 'superadmin' ||
            ['Admin', 'CEO', 'Internal'].includes(loggedUser?.position)
          ) && !isSkeleton && (
              <button className="pure-blue-btn ml-2 print:hidden" onClick={handleAddDriverClick} disabled={loading}>
                {loading ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  // 'Add Strategic Driver'
                  <>
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add Strategic Driver
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
              <th className="border px-4 py-2 ">Strategic Drivers</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2 text-center">KPI Annual Target Range</th>
              {/* {loggedUser?.role === 'superadmin' && (
                <th className="border px-4 py-2 text-center">Delete</th>
              )} */}

              {/* {loggedUser?.role === 'superadmin' && !isSkeleton && ( */}
              {(
                loggedUser?.role === 'superadmin' ||
                ['Admin', 'CEO', 'Internal'].includes(loggedUser?.position)
              ) && !isSkeleton && (
                <th className="border px-4 py-2 text-center print:hidden">Delete</th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentOrder.map(driver => (
              <tr key={driver.id}

                // draggable
                // onDragStart={(e) => handleDragStart(e, driver.id)}
                // onDragOver={(e) => handleDragOver(e, driver.id)}
                // onDragEnd={handleDragEnd}
                // className="hover:bg-gray-50 cursor-move"

                // when user is super admin , the table cell can't drag and drop
                //   draggable={loggedUser?.role === 'superadmin'}
                //   onDragStart={loggedUser?.role === 'superadmin' ? (e) => handleDragStart(e, driver.id) : undefined}
                //   onDragOver={loggedUser?.role === 'superadmin' ? (e) => handleDragOver(e, driver.id) : undefined}
                //   onDragEnd={loggedUser?.role === 'superadmin' ? handleDragEnd : undefined}
                //   className={`hover:bg-gray-50 ${loggedUser?.role === 'superadmin' ? 'cursor-move' : ''}`}

                draggable={
                  // loggedUser?.role === 'superadmin' &&
                  (
                    loggedUser?.role === 'superadmin' ||
                    ['Admin', 'CEO', 'Internal'].includes(loggedUser?.position)
                  ) &&
                  driver.title !== '-' &&
                  driver.description !== '-' &&
                  driver.kpi !== '-' &&
                  driver.status !== '-'
                }
                onDragStart={
                  // loggedUser?.role === 'superadmin' &&
                  (
                    loggedUser?.role === 'superadmin' ||
                    ['Admin', 'CEO', 'Internal'].includes(loggedUser?.position)
                  ) &&
                  driver.title !== '-' &&
                  driver.description !== '-' &&
                  driver.kpi !== '-' &&
                  driver.status !== '-'
                    ? (e) => handleDragStart(e, driver.id)
                    : undefined
                }
                onDragOver={
                  // loggedUser?.role === 'superadmin' &&
                  (
                    loggedUser?.role === 'superadmin' ||
                    ['Admin', 'CEO', 'Internal'].includes(loggedUser?.position)
                  ) &&
                  driver.title !== '-' &&
                  driver.description !== '-' &&
                  driver.kpi !== '-' &&
                  driver.status !== '-'
                    ? (e) => handleDragOver(e, driver.id)
                    : undefined
                }
                onDragEnd={
                  // loggedUser?.role === 'superadmin' &&
                  (
                    loggedUser?.role === 'superadmin' ||
                    ['Admin', 'CEO', 'Internal'].includes(loggedUser?.position)
                  ) &&
                  driver.title !== '-' &&
                  driver.description !== '-' &&
                  driver.kpi !== '-' &&
                  driver.status !== '-'
                    ? handleDragEnd
                    : undefined
                }
                className={`hover:bg-gray-50 ${
                  // loggedUser?.role === 'superadmin' &&
                  (
                    loggedUser?.role === 'superadmin' ||
                    ['Admin', 'CEO', 'Internal'].includes(loggedUser?.position)
                  ) &&
                  driver.title !== '-' &&
                  driver.description !== '-' &&
                  driver.kpi !== '-' &&
                  driver.status !== '-'
                    ? 'cursor-move'
                    : 'cursor-default'
                }`}
              >

                 {/* Implement Drag and Drop */}

                {/* <td className="border px-4 py-3">{driver.id}</td>

                <td
                  className="border px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleCellClick(driver.id, 'title')}
                >
                  {editingCell.id === driver.id && editingCell.field === 'title' ? (
                    <input
                      autoFocus
                      type="text"
                      defaultValue={driver.title}
                      onBlur={(e) => handleInputBlur(driver.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    driver.title
                  )}
                </td>

                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => handleCellClick(driver.id, 'description')}
                >
                  {editingCell.id === driver.id && editingCell.field === 'description' ? (
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

                <td className="border px-4 py-3 text-center cursor-pointer" onClick={() => handleCellClick(driver.id, 'kpi')}>
                  {editingCell.id === driver.id && editingCell.field === 'kpi' ? (
                    <input
                      autoFocus
                      type="text"
                      defaultValue={driver.kpi}
                      onBlur={(e) => handleInputBlur(driver.id, 'kpi', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-center"
                    />
                  ) : (
                    <span className="text-xs text-gray-500 block">
                      {driver.kpi || 'tbd'}
                    </span>
                  )}

                  <div className="mt-1" onClick={(e) => {
                    e.stopPropagation(); // Prevent row click conflict
                    handleCellClick(driver.id, 'status');
                  }}>
                    {editingCell.id === driver.id && editingCell.field === 'status' ? (
                      <select
                        autoFocus
                        defaultValue={driver.status}
                        onBlur={(e) => handleInputBlur(driver.id, 'status', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-xs text-center"
                      >
                        <option value="Tracking">Tracking</option>
                        <option value="Behind">Behind</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Paused">Paused</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          driver.status === 'Tracking'
                            ? 'bg-green-100 text-green-700'
                            : driver.status === 'Behind'
                            ? 'bg-red-100 text-red-700'
                            : driver.status === 'At Risk'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {driver.status || 'Tracking'}
                      </span>
                    )}
                  </div>
                </td> */}
                

                {/* Implement skeleton  Loading */}

                <td className="border px-4 py-3">{isSkeleton ? <div className="skeleton w-6"></div> : driver.id}</td>

                <td
                  className="border px-4 py-3 font-medium cursor-pointer"
                  onClick={() => driver.title !== '-' && handleCellClick(driver.id, 'title')}
                >
                  {driver.title === '-' ? (
                    <div className="skeleton w-32 h-4"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'title' ? (
                    <input
                      autoFocus
                      type="text"
                      defaultValue={driver.title}
                      onBlur={(e) => handleInputBlur(driver.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    driver.title
                  )}
                </td>


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


                <td
                  className="border px-4 py-3 text-center cursor-pointer"
                  onClick={() => driver.kpi !== '-' && handleCellClick(driver.id, 'kpi')}
                >
                  {driver.kpi === '-' ? (
                    <div className="skeleton w-24 h-4 mx-auto"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'kpi' ? (
                    <input
                      autoFocus
                      type="text"
                      defaultValue={driver.kpi}
                      onBlur={(e) => handleInputBlur(driver.id, 'kpi', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-center"
                    />
                  ) : (
                    <span className="text-xs text-gray-500 block">{driver.kpi}</span>
                  )}

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
                      <select
                        autoFocus
                        defaultValue={driver.status}
                        onBlur={(e) => handleInputBlur(driver.id, 'status', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-xs text-center"
                      >
                        <option value="Tracking">Tracking</option>
                        <option value="Behind">Behind</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Paused">Paused</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          driver.status === 'Tracking'
                            ? 'bg-green-100 text-green-700'
                            : driver.status === 'Behind'
                            ? 'bg-red-100 text-red-700'
                            : driver.status === 'At Risk'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {driver.status}
                      </span>
                    )}
                  </div>
                </td>

                {/* {loggedUser?.role === 'superadmin' && (
                  <td className="border px-4 py-3 text-center">
                    <div
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </div>
                  </td>
                )} */}

                {/* {loggedUser?.role === 'superadmin' && !isSkeleton && ( */}
                {loggedUser?.role === 'superadmin' || ['Admin', 'CEO', 'Internal'].includes(loggedUser?.position) && !isSkeleton && (
                  <td className="border px-4 py-3 text-center print:hidden">
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

          {/* <tbody className="text-sm text-gray-800">
            {strategicDrivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-gray-50">
                <td className="border px-4 py-3">{driver.id}</td>

                <td
                  className="border px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleCellClick(driver.id, 'title')}
                >
                  {editingCell.id === driver.id && editingCell.field === 'title' ? (
                    <input
                      autoFocus
                      type="text"
                      defaultValue={driver.title}
                      onBlur={(e) => handleInputBlur(driver.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    driver.title
                  )}
                </td>

                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => handleCellClick(driver.id, 'description')}
                >
                  {editingCell.id === driver.id && editingCell.field === 'description' ? (
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

                <td className="border px-4 py-3 text-center cursor-pointer" onClick={() => handleCellClick(driver.id, 'kpi')}>
                  {editingCell.id === driver.id && editingCell.field === 'kpi' ? (
                    <input
                      autoFocus
                      type="text"
                      defaultValue={driver.kpi}
                      onBlur={(e) => handleInputBlur(driver.id, 'kpi', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-center"
                    />
                  ) : (
                    <span className="text-xs text-gray-500 block">
                      {driver.kpi || 'tbd'}
                    </span>
                  )}

                  <div className="mt-1" onClick={(e) => {
                    e.stopPropagation(); // Prevent row click conflict
                    handleCellClick(driver.id, 'status');
                  }}>
                    {editingCell.id === driver.id && editingCell.field === 'status' ? (
                      <select
                        autoFocus
                        defaultValue={driver.status}
                        onBlur={(e) => handleInputBlur(driver.id, 'status', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-xs text-center"
                      >
                        <option value="Tracking">Tracking</option>
                        <option value="Behind">Behind</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Paused">Paused</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          driver.status === 'Tracking'
                            ? 'bg-green-100 text-green-700'
                            : driver.status === 'Behind'
                            ? 'bg-red-100 text-red-700'
                            : driver.status === 'At Risk'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {driver.status || 'Tracking'}
                      </span>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody> */}
        </table>
      </div>

      {/* {showConfirmModal && (
        <div
          className="modal-overlay"
          onClick={cancelDischargeChanges}// Close when clicking background
          
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
          >
            <p className="text-lg font-semibold mb-4">Are you sure?</p>
            <p className="text-sm text-gray-600">This will discharge the changes you made.</p>

            <div className="modal-buttons">
              <button className="btn-yes" onClick={confirmDischargeChanges}>Yes</button>
              <button className="btn-no" onClick={() => setShowConfirmModal(false)}>No</button>
            </div>
          </div>
        </div>
      )} */}

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
            <div className="modal-add-title">Add Strategic Driver</div>

            <label className="modal-add-label">Strategic Drivers</label>
            <input
              className="modal-add-input"
              type="text"
              value={newDriver.title}
              onChange={(e) => setNewDriver({ ...newDriver, title: e.target.value })}
            />

            <label className="modal-add-label">Description</label>
            <textarea
              className="modal-add-input"
              rows="3"
              value={newDriver.description}
              onChange={(e) => setNewDriver({ ...newDriver, description: e.target.value })}
            />

            <label className="modal-add-label">KPI Annual Target Range</label>
            <input
              className="modal-add-input"
              type="text"
              value={newDriver.kpi}
              onChange={(e) => setNewDriver({ ...newDriver, kpi: e.target.value })}
            />

            <label className="modal-add-label">Status</label>
            <select
              className="modal-add-select"
              value={newDriver.status}
              onChange={(e) => setNewDriver({ ...newDriver, status: e.target.value })}
            >
              <option>Tracking</option>
              <option>Behind</option>
              <option>At Risk</option>
              <option>Paused</option>
            </select>

            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAddNewDriver}>Add</button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default StrategicDriversTable;
