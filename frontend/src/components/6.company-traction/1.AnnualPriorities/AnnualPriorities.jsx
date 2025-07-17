// frontend\src\components\6.company-traction\1.AnnualPriorities\AnnualPriorities.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import useAnnualPrioritiesStore, { initialAnnualPriorities } from '../../../store/left-lower-content/6.company-traction/1.annualPrioritiesStore';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './AnnualPriorities.css';

const AnnualPriorities = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });

  const loggedUser = useLoginStore((state) => state.user);
  const annualPriorities = useAnnualPrioritiesStore((state) => state.annualPriorities);
  const setAnnualPriorities = useAnnualPrioritiesStore((state) => state.setAnnualPriorities);
  const updateAnnualPrioritiesField = useAnnualPrioritiesStore((state) => state.updateAnnualPrioritiesField);
  const pushAnnualPriorities = useAnnualPrioritiesStore((state) => state.pushAnnualPriorities);

  const [editedAnnualPriorities, setEditedAnnualPriorities] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnnualPriority, setNewAnnualPriority] = useState({
    description: '',
    status: 'Tracking',
  });

  const [currentOrder, setCurrentOrder] = useState(annualPriorities);
  const [draggedId, setDraggedId] = useState(null);
  
  

  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('annualPrioritiesData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setAnnualPriorities(parsedData);

        // ✅ Treat this as unsaved state, trigger the buttons
        setEditedAnnualPriorities(parsedData.map((d) => ({ id: d.id })));

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
    setEditedAnnualPriorities([]);
  
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
    setEditedAnnualPriorities((prev) => {
      const existing = prev.find((d) => d.id === id);
      if (existing) {
        return prev.map((d) =>
          d.id === id ? { ...d, [field]: value } : d
        );
      }
      return [...prev, { id, [field]: value }];
    });

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
          setEditedAnnualPriorities([]);
  
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
        setEditedAnnualPriorities([]);

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
    setEditedAnnualPriorities([]);

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
    setEditedAnnualPriorities(prev => prev.find(d=>d.id===draggedId) ? prev : [...prev, { id: draggedId }]);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setAnnualPriorities(currentOrder);
    setEditedAnnualPriorities([]);
  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('annualPrioritiesData');
    setShowConfirmModal(false);
    setCurrentOrder(annualPriorities);
    setEditedAnnualPriorities([]);
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
    setEditedAnnualPriorities(prev => [...prev, { id }]);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Annual Priorities</h5>
        {loggedUser?.role === 'superadmin' && (
          <div className="flex gap-2">
            {editedAnnualPriorities.length > 0 && (
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

            {loggedUser?.role === 'superadmin' && !isSkeleton && (
              <button className="pure-blue-btn ml-2" onClick={handleAddDriverClick} disabled={loading}>
                {loading ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  'Add Annual Priority'
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
              <th className="border px-4 py-2 ">Description</th>
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
                  driver.description !== '-' &&
                  driver.status !== '-'
                }
                onDragStart={
                  loggedUser?.role === 'superadmin' &&
                  driver.description !== '-' &&
                  driver.status !== '-'
                    ? (e) => handleDragStart(e, driver.id)
                    : undefined
                }
                onDragOver={
                  loggedUser?.role === 'superadmin' &&
                  driver.description !== '-' &&
                  driver.status !== '-'
                    ? (e) => handleDragOver(e, driver.id)
                    : undefined
                }
                onDragEnd={
                  loggedUser?.role === 'superadmin' &&
                  driver.description !== '-' &&
                  driver.status !== '-'
                    ? handleDragEnd
                    : undefined
                }
                className={`hover:bg-gray-50 ${
                  loggedUser?.role === 'superadmin' &&
                  driver.description !== '-' &&
                  driver.status !== '-'
                    ? 'cursor-move'
                    : 'cursor-default'
                }`}
              >

                {/* Implement skeleton  Loading */}
                
                {/* id */}
                <td className="border px-4 py-3">{isSkeleton ? <div className="skeleton w-6"></div> : driver.id}</td>

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

                {/* status */}
                <td
                
                //   className="border px-4 py-3 text-center cursor-pointer"
                //   onClick={() => driver.kpi !== '-' && handleCellClick(driver.id, 'kpi')}
                >
                  {/* {driver.kpi === '-' ? (
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
                  )} */}

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
                        <option value="100.00%">100.00%</option>
                        <option value="83.33%">83.33%</option>
                        <option value="0.00%">0.00%</option>
                        <option value="50.00%">50.00%</option>
                      </select>
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
            <div className="modal-add-title">Confirm Discharge</div>
            <p className="text-gray-700 text-sm mb-4">
              Are you sure you want to discard all unsaved changes?
            </p>
            <div className="modal-add-buttons">
              <button className="btn-add" onClick={confirmDischargeChanges}>Yes, Discharge</button>
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
            <div className="modal-add-title">Annual Priorities</div>

            <label className="modal-add-label">Description</label>
            <textarea
              className="modal-add-input"
              rows="3"
              value={newAnnualPriority.description}
              onChange={(e) => setNewAnnualPriority({ ...newAnnualPriority, description: e.target.value })}
            />


            <label className="modal-add-label">Status</label>
            <select
              className="modal-add-select"
              value={newAnnualPriority.status}
              onChange={(e) => setNewAnnualPriority({ ...newAnnualPriority, status: e.target.value })}
            >
              <option>100.00%</option>
              <option>83.33%</option>
              <option>0.00%</option>
              <option>50.00%</option>
            </select>

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

export default AnnualPriorities;
