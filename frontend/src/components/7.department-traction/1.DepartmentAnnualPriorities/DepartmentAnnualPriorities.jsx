// frontend\src\components\7.department-traction\1.DepartmentAnnualPriorities\DepartmentAnnualPriorities.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faSave, faSignOutAlt, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import ToastNotification from '../../../components/toast-notification/ToastNotification';
import useDepartmentAnnualPrioritiesStore, { initialDepartmentAnnualPriorities } from '../../../store/left-lower-content/7.department-traction/1.departmentAnnualPrioritiesStores';
import useSwitchOptionsStore from '../../../store/left-lower-content/7.department-traction/4.switchOptionsStore';
import CustomDropdown from '../../CustomDropdown/CustomDropdown';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';

import './DepartmentAnnualPriorities.css';

const DepartmentAnnualPriorities = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });
  const organization = useLayoutSettingsStore((state) => state.organization);

  const loggedUser = useLoginStore((state) => state.user);

  const storeDepartmentAnnualPriorities = useDepartmentAnnualPrioritiesStore((state) => state.departmentAnnualPriorities);
  const [departmentAnnualPriorities, setDepartmentAnnualPriorities] = useState([]);
  // const departmentAnnualPriorities = useDepartmentAnnualPrioritiesStore((state) => state.departmentAnnualPriorities);
  // const setDepartmentAnnualPriorities = useDepartmentAnnualPrioritiesStore((state) => state.setDepartmentAnnualPriorities);
  const updateAnnualPrioritiesField = useDepartmentAnnualPrioritiesStore((state) => state.updateAnnualPrioritiesField);
  const pushDepartmentAnnualPriorities = useDepartmentAnnualPrioritiesStore((state) => state.pushDepartmentAnnualPriorities);
  // const { departmentAnnualPriorities, setDepartmentAnnualPriorities, updateAnnualPrioritiesField  } = useDepartmentAnnualPrioritiesStore();

  const { switchOptions, setSwitchOptions, addSwitchOption, removeSwitchOption } = useSwitchOptionsStore();


  const [editedAnnualPriorities, setEditedAnnualPriorities] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnnualPriority, setNewAnnualPriority] = useState({
    description: '',
    status: '00.00%',
  });

  const [currentOrder, setCurrentOrder] = useState(departmentAnnualPriorities);
  const [draggedId, setDraggedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  // const [switchOptions, setSwitchOptions] = useState(["Option 1", "Option 2"]);
  const [selectedOption, setSelectedOption] = useState("");
  const [newOption, setNewOption] = useState("");


  const [toast, setToast] = useState({
    message: '',
    status: '',
    isVisible: false,
  });
  
  const showToast = (message, status) => {
    setToast({ message, status, isVisible: true });
  };
  
  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(departmentAnnualPriorities);
  }, [departmentAnnualPriorities]);

  
  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('departmentAnnualPrioritiesData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setDepartmentAnnualPriorities(parsedData);
        console.log("Load from localStorage: ", storedData);
        setEditedAnnualPriorities(parsedData.map((d) => ({ id: d.id })));

      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Failed to parse departmentAnnualPrioritiesData from localStorage:', err);
      }
    }
    else {
      // // Store the initial state (only once)
      // const currentData = useDepartmentAnnualPrioritiesStore.getState().departmentAnnualPriorities;
      // useDepartmentAnnualPrioritiesStore.getState().setBaselineDepartmentAnnualPriorities(currentData)
      // console.log("Store the initial state (only once): ", currentData);

      // ✅ fallback if nothing in localStorage
      setDepartmentAnnualPriorities(storeDepartmentAnnualPriorities); // fallback to store if no localStorage
      setCurrentOrder(storeDepartmentAnnualPriorities);

    }
  }, [storeDepartmentAnnualPriorities]);


  const confirmDischargeChanges = () => {
    // 1. Remove from localStorage
    localStorage.removeItem('departmentAnnualPrioritiesData');

    // 2. Clear edited state (hides buttons)
    setEditedAnnualPriorities([]);

    // 3. Update Zustand store
    // setDepartmentAnnualPriorities(initialDepartmentAnnualPriorities);
    // const { baselineDepartmentAnnualPriorities } = useDepartmentAnnualPrioritiesStore.getState();
    // setCurrentOrder(baselineDepartmentAnnualPriorities);

    const currentState = useDepartmentAnnualPrioritiesStore.getState().departmentAnnualPriorities;
    setDepartmentAnnualPriorities(currentState); // rollback to store state
    setCurrentOrder(currentState);

    // ✅ Log the baseline data for debugging
    // console.log('🔁 Restoring from baselineDepartmentAnnualPriorities:', baselineDepartmentAnnualPriorities);

    // 4. Hide Modal
    setShowConfirmModal(false);
  };

  const handleInputBlur = (id, field, value) => {
    // updateAnnualPrioritiesField(id, field, value);

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
    const updatedDrivers = departmentAnnualPriorities.map((driver) =>
      driver.id === id ? { ...driver, [field]: value } : driver
    );
    localStorage.setItem('departmentAnnualPrioritiesData', JSON.stringify(updatedDrivers));

    setEditingCell({ id: null, field: null });
  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };

  
  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add Department Annual Priorities button clicked');
      setShowAddModal(true);
    }, 1000);
  };


const handleAddNewAnnualPriority = async () => {

  // Set defaults if empty
  const priorityToSend = {
    description: newAnnualPriority.description?.trim() || 'empty',
    status: newAnnualPriority.status || '0.00%',
  };

  ENABLE_CONSOLE_LOGS && console.log('New Annual Priority:', JSON.stringify(priorityToSend, null, 2));

  try {
    const csrfRes = await fetch(`${API_URL}/csrf-token`, {
      credentials: 'include',
    });
    const { csrf_token } = await csrfRes.json();

    const org = useLayoutSettingsStore.getState().organization;

    const response = await fetch(`${API_URL}/v1/department-traction/annual-priorities/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrf_token,
      },
      credentials: 'include',
      body: JSON.stringify({
        organizationName: org,
        newAnnualPriority: priorityToSend,
      }),
    });

    const result = await response.json();
    ENABLE_CONSOLE_LOGS && console.log('📬 Insert API Response:', result);

    if (!response.ok || result.status !== 'success') {
      console.error('❌ Failed to insert new department annual priority:', result.message);
      return;
    }

    const itemWithId = result.data;

    // ✅ Push to Zustand store
    pushDepartmentAnnualPriorities(itemWithId);

    // 🔄 Clean up UI
    setEditedAnnualPriorities([]);
    localStorage.removeItem('departmentAnnualPrioritiesData');
    setShowAddModal(false);
    setNewAnnualPriority({ description: '', status: '00.00%' });

  } catch (err) {
    console.error('❌ Error inserting department annual priority:', err);
  }
};

  

  const handleCellClick = (id, field) => {
    if (loggedUser?.role === 'superadmin') {
      setEditingCell({ id, field });
    }
  };


  const handleSaveChanges = () => {
    setLoadingSave(true);
  
    setTimeout(async () => {
      try {
        const storedData = localStorage.getItem('departmentAnnualPrioritiesData');
  
        let reordered = [];
  
        if (storedData) {
          const parsedData = JSON.parse(storedData);
  
          ENABLE_CONSOLE_LOGS && console.log('📥 Saved Department Annual Priorities from localStorage:', parsedData);
  
          reordered = parsedData.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
  
          ENABLE_CONSOLE_LOGS && console.log('📥 Reindexed Department Annual Priorities:', reordered);
  
          // Update Zustand store
          setDepartmentAnnualPriorities(reordered);
        } else {
          // No localStorage data — use currentOrder
          reordered = currentOrder.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
  
          ENABLE_CONSOLE_LOGS && console.log('📥 Reindexed Department Annual Priorities (from currentOrder):', reordered);
  
          setDepartmentAnnualPriorities(reordered);
        }
  
        setEditedAnnualPriorities([]);
        localStorage.removeItem('departmentAnnualPrioritiesData');
  
        // 🛰️ Push to backend
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
  
        const { csrf_token } = await csrfRes.json();
  
        const org = useLayoutSettingsStore.getState().organization;
  
        const response = await fetch(`${API_URL}/v1/department-traction/annual-priorities/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organizationName: org,
            annualPrioritiesData: reordered,
          }),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          console.error('❌ Failed to update department annual priorities:', result.message || 'Unknown error');
        } else {
          ENABLE_CONSOLE_LOGS && console.log('✅ Department Annual Priorities Update Response:', result);
        }
  
        setIsEditing(false);
      } catch (err) {
        console.error('❌ Error during save process:', err);
      } finally {
        setLoadingSave(false);
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
    setEditedAnnualPriorities(prev => prev.find(d=>d.id===draggedId) ? prev : [...prev, { id: draggedId }]);
  };


  const handleDragEnd = () => {
    setDraggedId(null);
  
    // Save the new drag order to localStorage
    localStorage.setItem('departmentAnnualPrioritiesData', JSON.stringify(currentOrder));
  
    // Also flag changes for Save/Discharge buttons
    setEditedAnnualPriorities(currentOrder.map(d => ({ id: d.id })));
  
    ENABLE_CONSOLE_LOGS && console.log('Drag ended and saved to localStorage:', currentOrder);
  };

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setDepartmentAnnualPriorities(currentOrder);
    setEditedAnnualPriorities([]);
  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('departmentAnnualPrioritiesData');
    setShowConfirmModal(false);
    setCurrentOrder(departmentAnnualPriorities);
    setEditedAnnualPriorities([]);
  };

  const isSkeleton = departmentAnnualPriorities.some(driver => 
    driver.description === '-' &&
    driver.status === '-'
  );

  const handleDeleteDriver = (id) => {
    const updated = departmentAnnualPriorities.filter(driver => driver.id !== id);
    setDepartmentAnnualPriorities(updated);
    localStorage.setItem('departmentAnnualPrioritiesData', JSON.stringify(updated));
  
    // Mark as edited
    setEditedAnnualPriorities(prev => [...prev, { id }]);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Department Annual Priorities</h5>
        {loggedUser?.role === 'superadmin' && (
          <div className="flex gap-2">

            {/* Switch Button */}
            <div
              className="pure-purple-btn cursor-pointer flex items-center print:hidden"
              onClick={() => setSwitchModalOpen(true)}
            >
              <>
              <FontAwesomeIcon icon={faExchangeAlt} className="mr-1" />
                Switch
              </>
              
            </div>

            {editedAnnualPriorities.length > 0 && (
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

            {loggedUser?.role === 'superadmin' && !isSkeleton && (
              <button className="pure-blue-btn ml-2 print:hidden" onClick={handleAddDriverClick} disabled={loading}>
                {loading ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <>
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add Department Annual Priorities
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
              <th className="border px-4 py-2 ">Description</th>
              <th className="border px-4 py-2"></th>
              {loggedUser?.role === 'superadmin' && !isSkeleton && (
                <th className="border px-4 py-2 text-center print:hidden"></th>
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
            <div className="modal-add-title">Department Annual Priorities</div>

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
              
              <option>0.00%</option>
              <option>50.00%</option>
              <option>83.33%</option>
              <option>100.00%</option>
            </select>

            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAddNewAnnualPriority}>Add</button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Modal */}
      {switchModalOpen && (
          <div
            className="transparent-overlay"
            onClick={() => setSwitchModalOpen(false)}
          >
            <div
              className="switch-modal-container relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-2 right-3 text-gray-600 text-lg font-bold"
                onClick={() => setSwitchModalOpen(false)}
              >
                ×
              </button>

              {/* Add extra vertical space */}
              <div className="mt-10"></div>

              {/* Dropdown + Set Default */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <CustomDropdown
                  options={switchOptions}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                />

                <button
                  className="pure-blue2-btn whitespace-nowrap"
                  onClick={() => {
                    console.log('Set Default:', selectedOption);
                    showToast(`Set Default: ${selectedOption}`, 'success');
                  }}
                >
                  Set Default
                </button>
              </div>

              {/* Delete & New */}
              <div className="flex justify-between mt-4">
                <button
                  className="pure-red2-btn w-1/2 mr-2"
                  onClick={() => {
                    console.log('Delete:', selectedOption);
                    showToast(`Deleted: ${selectedOption}`, 'success');
                  }}
                >
                  Delete
                </button>
                <button
                  className="pure-green2-btn w-1/2 ml-2"
                  onClick={() => setShowNewModal(true)}
                >
                  New
                </button>
              </div>
            </div>
          </div>
        )}


      {/* New Option Modal */}
      {showNewModal && (
        <div
          className="transparent-overlay"
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="modal-content relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-2 right-3 text-gray-600 text-lg font-bold"
              onClick={() => setShowNewModal(false)}
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-4">Add New Option</h3>

            <input
              type="text"
              className="border rounded w-full p-2 mb-4"
              placeholder="Enter new option name"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                className="pure-blue2-btn"
                onClick={() => {
                  console.log('Add:', newOption);
                  showToast(`Added: ${newOption}`, 'success');
                  // Close the new modal after adding if needed here
                  setShowNewModal(false);
                  setNewOption('');
                }}
              >
                Add
              </button>
              <button
                className="pure-red2-btn"
                onClick={() => setShowNewModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        status={toast.status}
      />

    </div>

  );
};

export default DepartmentAnnualPriorities;
