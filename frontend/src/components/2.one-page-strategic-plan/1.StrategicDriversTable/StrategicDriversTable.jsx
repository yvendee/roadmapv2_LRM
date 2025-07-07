// frontend\src\components\one-page-strategic-plan\1.StrategicDriversTable\StrategicDriversTable.jsx
import React, { useState, useEffect} from 'react';
import './StrategicDriversTable.css';
import useLoginStore from '../../../store/loginStore';
import useStrategicDriversStore, { initialStrategicDrivers } from '../../../store/left-lower-content/2.one-page-strategic-plan/1.strategicDriversStore';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';

const StrategicDriversTable = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });

  const loggedUser = useLoginStore((state) => state.user);
  const strategicDrivers = useStrategicDriversStore((state) => state.strategicDrivers);
  const setStrategicDrivers = useStrategicDriversStore((state) => state.setStrategicDrivers);
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
  useEffect(() => {
    const storedData = localStorage.getItem('strategicDriversData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setStrategicDrivers(parsedData);

        // ✅ Treat this as unsaved state, trigger the buttons
        setEditedDrivers(parsedData.map((d) => ({ id: d.id })));

      } catch (err) {
        ENABLE_CONSOLE_LOGS &&  console.error('Failed to parse strategicDriversData from localStorage:', err);
      }
    }
  }, [setStrategicDrivers]);

  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // console.log('Add Strategic Drivers button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  const handleAddNewDriver = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New Driver:', JSON.stringify(newDriver, null, 2));

    // 2. Hide Save / Discharge
    setEditedDrivers([]);
  
    // 3. Remove localStorage temp data
    localStorage.removeItem('strategicDriversData');
  
    // 4. Push to Zustand store
    pushStrategicDriver(newDriver);
  
    // 5. Optionally: force-refresh the UI by resetting store (if needed)
    // Not required unless you deep reset from localStorage elsewhere
  
    // Close modal
    setShowAddModal(false);
  
    // Reset form input
    setNewDriver({ title: '', description: '', kpi: '', status: 'Tracking' });
  };

  const handleCellClick = (id, field) => {
    if (loggedUser?.role === 'superadmin') {
      setEditingCell({ id, field });
    }
  };

  const handleInputBlur = (id, field, value) => {
    updateDriverField(id, field, value);

    // Update local state for Save/Discharge buttons
    setEditedDrivers((prev) => {
      const existing = prev.find((d) => d.id === id);
      if (existing) {
        return prev.map((d) =>
          d.id === id ? { ...d, [field]: value } : d
        );
      }
      return [...prev, { id, [field]: value }];
    });

    // Update localStorage
    const updatedDrivers = strategicDrivers.map((driver) =>
      driver.id === id ? { ...driver, [field]: value } : driver
    );
    localStorage.setItem('strategicDriversData', JSON.stringify(updatedDrivers));

    setEditingCell({ id: null, field: null });
  };


  
  const handleSaveChanges = () => {

    setLoadingSave(true);
  
    setTimeout(() => {
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
    localStorage.removeItem('strategicDriversData');

    // 2. Clear edited state (hides buttons)
    setEditedDrivers([]);

    // 3. Update Zustand store
    setStrategicDrivers(initialStrategicDrivers);

    // 4. Hide Modal
    setShowConfirmModal(false);
  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };


  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(strategicDrivers);
  }, [strategicDrivers]);

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
    setEditedDrivers(prev => prev.find(d=>d.id===draggedId) ? prev : [...prev, { id: draggedId }]);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
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

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Strategic Drivers</h5>
        {loggedUser?.role === 'superadmin' && (
          <div className="flex gap-2">
            {editedDrivers.length > 0 && (
              <>
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
                      'Discharge Changes'
                  )}
                </button>
              </>
            )}
            <button className="pure-blue-btn ml-2" onClick={handleAddDriverClick} disabled={loading}>
              {loading ? (
                <div className="loader-bars">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                'Add Strategic Driver'
              )}
            </button>
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
                  loggedUser?.role === 'superadmin' &&
                  driver.title !== '-' &&
                  driver.description !== '-' &&
                  driver.kpi !== '-' &&
                  driver.status !== '-'
                }
                onDragStart={
                  loggedUser?.role === 'superadmin' &&
                  driver.title !== '-' &&
                  driver.description !== '-' &&
                  driver.kpi !== '-' &&
                  driver.status !== '-'
                    ? (e) => handleDragStart(e, driver.id)
                    : undefined
                }
                onDragOver={
                  loggedUser?.role === 'superadmin' &&
                  driver.title !== '-' &&
                  driver.description !== '-' &&
                  driver.kpi !== '-' &&
                  driver.status !== '-'
                    ? (e) => handleDragOver(e, driver.id)
                    : undefined
                }
                onDragEnd={
                  loggedUser?.role === 'superadmin' &&
                  driver.title !== '-' &&
                  driver.description !== '-' &&
                  driver.kpi !== '-' &&
                  driver.status !== '-'
                    ? handleDragEnd
                    : undefined
                }
                className={`hover:bg-gray-50 ${
                  loggedUser?.role === 'superadmin' &&
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

      {showConfirmModal && (
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
