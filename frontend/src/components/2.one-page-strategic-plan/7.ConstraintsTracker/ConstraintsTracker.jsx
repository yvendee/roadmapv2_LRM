// frontend\src\components\one-page-strategic-plan\7.ConstraintsTracker\ConstraintsTracker.jsx

import React, { useEffect, useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import useConstraintsTracker, { initialConstraintsTracker } from '../../../store/left-lower-content/2.one-page-strategic-plan/7.constraintsTrackerStore';
import { useCompanyTractionUserStore } from '../../../store/layout/companyTractionUserStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './ConstraintsTracker.css';

const ConstraintsTracker = () => {
  const user = useLoginStore((state) => state.user);
  // const { constraintsTracker, setConstraintsTracker, pushConstraintsTracker } = useConstraintsTracker();
  const pushConstraintsTracker = useConstraintsTracker((state) => state.pushConstraintsTracker);
  const storeConstraintsTracker = useConstraintsTracker((state) => state.constraintsTracker);
  const [constraintsTracker, setConstraintsTracker] = useState([]); // Local copy

  const organization = useLayoutSettingsStore((state) => state.organization);
  const users = useCompanyTractionUserStore((state) => state.users);
  const [editing, setEditing] = useState({ rowId: null, field: null });
  const [edited, setEdited] = useState([]);
  const [newConstraintsTracker, setNewConstraintsTracker] = useState({ constraintTitle: '', description: '', owner: '', actions: '', status: ''});
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formError, setFormError] = useState('');


  useEffect(() => {
    setConstraintsTracker(storeConstraintsTracker); // Copy from global store once
  }, [storeConstraintsTracker]);

  // const hasRealData = constraintsTracker.some(
  //   (item) =>
  //     item.constraintTitle !== '-' ||
  //     item.description !== '-' ||
  //     item.owner !== '-' ||
  //     item.actions !== '-' ||
  //     item.status !== '-'
  // );

  const hasRealData = constraintsTracker.some(item => item.value === '-');


  useEffect(() => {
    const stored = localStorage.getItem('ConstraintsTracker');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConstraintsTracker(parsed);
        setEdited(parsed.map((o) => ({ id: o.id })));
      } catch (e) {
        console.error('Invalid Constraints Tracker:', e);
      }
    }
  }, [setConstraintsTracker]);

  // const handleBlur = (id, field, value) => {
  //   const updated = constraintsTracker.map((item) =>
  //     item.id === id ? { ...item, [field]: value } : item
  //   );
  //   setConstraintsTracker(updated);
  //   localStorage.setItem('ConstraintsTracker', JSON.stringify(updated));
  //   if (!edited.includes(id)) setEdited([...edited, id]);
  //   setEditing({ rowId: null, field: null });
  // };

  const formatLabel = (field) => {
    // Insert space before capital letters, then capitalize the first letter
    const spaced = field.replace(/([A-Z])/g, ' $1'); // e.g., "constraintTitle" → "constraint Title"
    return spaced.charAt(0).toUpperCase() + spaced.slice(1); // Capitalize first letter
  };

  const handleBlur = (id, field, value) => {
    const updated = constraintsTracker.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setConstraintsTracker(updated);
    localStorage.setItem('ConstraintsTracker', JSON.stringify(updated));
  
    // Check if the edited item is already in the edited array
    if (!edited.some((e) => e.id === id)) {
      setEdited([...edited, { id }]);
    }
  
    setEditing({ rowId: null, field: null });
  };
  

  // const handleAdd = () => {

  //   const { constraintTitle, description, owner, actions, status } = newConstraintsTracker;
  //   // Validation logic
  //   if (!status || !owner) {
  //     setFormError('Please fill in all required fields: Owner and Status.');
  //     return;
  //   }

  //   const nextId = Math.max(0, ...constraintsTracker.map((o) => o.id || 0)) + 1;
  //   const newItem = { id: nextId, ...newConstraintsTracker };
  //   pushConstraintsTracker(newItem);
  //   localStorage.removeItem('ConstraintsTracker');
  //   setNewConstraintsTracker({ constraintTitle: '', description: '', owner: '', actions: '', status: ''});
  //   setShowAddModal(false);
  //   ENABLE_CONSOLE_LOGS && console.log('✅ New Constraints Tracker Added:', newItem);
  // };

  const handleAdd = async () => {
    const { constraintTitle, description, owner, actions, status } = newConstraintsTracker;
  
    if (!status || !owner) {
      setFormError('Please fill in all required fields: Owner and Status.');
      return;
    }
  
    const nextId = Math.max(0, ...constraintsTracker.map((o) => o.id || 0)) + 1;
    const newItem = {
      id: nextId,
      constraintTitle: constraintTitle.trim(),
      description: description.trim(),
      owner: owner.trim(),
      actions: actions.trim(),
      status: status.trim(),
    };
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const res = await fetch(`${API_URL}/v1/one-page-strategic-plan/constraints-tracker/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          newItem,
        }),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        pushConstraintsTracker(result.newItem);
        localStorage.removeItem('ConstraintsTracker');
        setNewConstraintsTracker({ constraintTitle: '', description: '', owner: '', actions: '', status: '' });
        setShowAddModal(false);
        ENABLE_CONSOLE_LOGS && console.log('✅ New Constraints Tracker Added:', result.newItem);
      } else {
        console.error('❌ Error adding new item:', result.message);
      }
    } catch (error) {
      console.error('❌ API error:', error);
    }
  };
  


  const handleAddDecisionClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add Strategic Drivers button clicked');
      setShowAddModal(true);
    }, 1000);
  };


  const handleDelete = (id) => {
    const updated = constraintsTracker.filter((item) => item.id !== id);
    setConstraintsTracker(updated);
    localStorage.setItem('ConstraintsTracker', JSON.stringify(updated));
    if (!edited.includes(id)) setEdited([...edited, id]);
    ENABLE_CONSOLE_LOGS && console.log(`🗑️ Constraints Tracker with ID ${id} deleted.`);
  };

  // const handleSave = () => {
  //   setLoadingSave(true);
  //   setTimeout(() => {
  //     setLoadingSave(false);
  //     ENABLE_CONSOLE_LOGS && console.log('📤 Saving Constraints Tracker:', constraintsTracker);
  //     setEdited([]);
  //     localStorage.removeItem('ConstraintsTracker');
  //   }, 1000);
  // };

  const handleSave = async () => {
    setLoadingSave(true);
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const response = await fetch(`${API_URL}/v1/one-page-strategic-plan/constraints-tracker/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          constraintsTrackerData: constraintsTracker,
        }),
      });
  
      const result = await response.json();
      setLoadingSave(false);
  
      if (response.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ Constraints Tracker updated:', result.updatedData);
        setEdited([]);
        localStorage.removeItem('ConstraintsTracker');
      } else {
        console.error('❌ Update failed:', result.message);
      }
    } catch (err) {
      setLoadingSave(false);
      console.error('❌ API error:', err);
    }
  };

  const handleDischargeChanges = () => {
    setLoadingDischarge(true);
    setTimeout(() => {
      setLoadingDischarge(false);
      setShowConfirmModal(true);
    }, 1000);
  };

  const confirmDischarge = () => {
    localStorage.removeItem('ConstraintsTracker');
    setEdited([]);
    // setConstraintsTracker(initialConstraintsTracker);
    const currentState = useConstraintsTracker.getState().constraintsTracker;
    setConstraintsTracker(currentState); // Use what's in the store, not initial
    setShowConfirmModal(false);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-md font-semibold text-green-700">Constraints Tracker</h5>
        {/* {user?.role === 'superadmin' && ( */}
        {(
          user?.role === 'superadmin' ||
          ['Admin', 'CEO', 'Internal'].includes(user?.position)
        ) && (
          <div className="flex gap-2">
            {edited.length > 0 && (
              <>
                <button className="pure-green-btn print:hidden" onClick={handleSave}>
                  {loadingSave ? (
                    <div className="loader-bars"><div></div><div></div><div></div></div>
                  ) : 
                  <>
                  <FontAwesomeIcon icon={faSave} className="mr-1" />
                  Save Changes
                  </>
                  }
                </button>
                <button className="pure-red-btn print:hidden" onClick={handleDischargeChanges} disabled={loadingDischarge}>
                  {loadingDischarge ? (
                    <div className="loader-bars"><div></div><div></div><div></div></div>
                  ) : 
                  <>
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                  Discard
                  </>
                  }
                </button>
              </>
            )}

            {/* {user?.role === 'superadmin' && !hasRealData && ( */}
            {(
              user?.role === 'superadmin' ||
              ['Admin', 'CEO', 'Internal'].includes(user?.position)
            ) && !hasRealData && (
              <button className="pure-blue-btn print:hidden" onClick={handleAddDecisionClick} disabled={loading}>
                {loading ? <div className="loader-bars"><div></div><div></div><div></div></div> : 
                <>
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Add Constraints Tracker
                </>
                }
              </button>
            )}

          </div>
        )}
      </div>

      <table className="min-w-full border border-gray-200 text-sm">
      <thead className="bg-gray-50 text-green-700 text-sm">
        <tr>
          <th className="border px-3 py-2">
            <div className="text-left">Constraint Title</div>
          </th>
          <th className="border px-3 py-2">
            <div className="flex justify-center items-center">Description</div>
          </th>
          <th className="border px-3 py-2">
            <div className="flex justify-center items-center">Owner</div>
          </th>
          <th className="border px-3 py-2">
            <div className="flex justify-center items-center">Actions</div>
          </th>
          <th className="border px-3 py-2">
            <div className="flex justify-center items-center">Status</div>
          </th>
          {/* {user?.role === 'superadmin' && !hasRealData && ( */}
          {(
            user?.role === 'superadmin' ||
            ['Admin', 'CEO', 'Internal'].includes(user?.position)
          ) && !hasRealData && (
            <th className="border px-3 py-2 print:hidden">
              <div className="flex justify-center items-center"></div>
            </th>
          )}
        </tr>
      </thead>

        <tbody>
        {constraintsTracker.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50">
            {['constraintTitle', 'description', 'owner', 'actions', 'status'].map((field) => (
              <td
                key={field}
                className={`border px-3 py-2 ${
                  ['description', 'owner', 'actions', 'status'].includes(field) ? 'text-center' : ''
                }`}
              >
                {editing.rowId === item.id && editing.field === field ? (
                  field === 'status' ? (
                    <select
                      autoFocus
                      defaultValue={item.status}
                      onBlur={(e) => handleBlur(item.id, field, e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs text-center"
                    >
                      <option>Tracking</option>
                      <option>Behind</option>
                      <option>At Risk</option>
                      <option>Paused</option>
                    </select>
                  ) : field === 'owner' ? (
                    // <select
                    //   autoFocus
                    //   value={item.owner || ''}
                    //   onChange={(e) => handleBlur(item.id, field, e.target.value)}
                    //   className="w-full px-2 py-1 border rounded text-xs text-center"
                    // >
                    //   <option value="" disabled>Select Owner</option>
                    //   {users.map((u) => (
                    //     <option key={u} value={u}>{u}</option>
                    //   ))}
                    // </select>
                    <select
                      autoFocus
                      value={item.owner || ''}
                      onBlur={(e) => handleBlur(item.id, field, e.target.value)}
                      onChange={(e) => handleBlur(item.id, field, e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs text-center"
                    >
                      <option value="" disabled>Select Owner</option>

                      {/* Always show current owner first */}
                      {item.owner && (
                        <option value={item.owner}>{item.owner}</option>
                      )}

                      {/* Show users from store excluding current owner to avoid duplicate */}
                      {users
                        .filter((u) => u !== item.owner)
                        .map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                    </select>


                  ) : (
                    <textarea
                      autoFocus
                      defaultValue={item[field]}
                      onBlur={(e) => handleBlur(item.id, field, e.target.value)}
                      className="w-full border rounded p-1 text-sm resize-y min-h-[40px]"
                    />
                  )
                ) : field === 'status' ? (
                  // <span
                  //   className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                  //     item.status === 'Tracking' ? 'bg-green-600' :
                  //     item.status === 'Behind' ? 'bg-yellow-500' :
                  //     item.status === 'At Risk' ? 'bg-red-500' :
                  //     item.status === 'Paused' ? 'bg-gray-500' :
                  //     'bg-gray-300'
                  //   } 
                  //   ${user?.role === 'superadmin' ? 'cursor-pointer' : ''}`}
                  //   onClick={() =>
                  //     user?.role === 'superadmin' && setEditing({ rowId: item.id, field })
                  //   }
                  // >
                  //   {item.status}
                  // </span>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      item.status === 'Tracking'
                        ? 'bg-green-600'
                        : item.status === 'Behind'
                        ? 'bg-yellow-500'
                        : item.status === 'At Risk'
                        ? 'bg-red-500'
                        : item.status === 'Paused'
                        ? 'bg-gray-500'
                        : 'bg-gray-300'
                    } ${
                      user?.role === 'superadmin' || ['Admin', 'CEO', 'Internal'].includes(user?.position)
                        ? 'cursor-pointer'
                        : ''
                    }`}
                    onClick={() => {
                      const canEdit =
                        user?.role === 'superadmin' || ['Admin', 'CEO', 'Internal'].includes(user?.position);
                      if (canEdit) {
                        setEditing({ rowId: item.id, field });
                      }
                    }}
                  >
                    {item.status}
                  </span>


                ) : (
                  // <span
                  //   className={user?.role === 'superadmin' ? 'cursor-pointer' : ''}
                  //   onClick={() =>
                  //     user?.role === 'superadmin' && setEditing({ rowId: item.id, field })
                  //   }
                  // >
                  //   {item[field] === '-' ? (
                  //     <div className="skeleton w-full h-4"></div>
                  //   ) : item[field] === null || item[field] === '' ? (
                  //     <span className="italic text-gray-400">Empty</span>
                  //   ) : (
                  //     item[field]
                  //   )}
                  // </span>
                  <span
                    className={
                      user?.role === 'superadmin' || ['Admin', 'CEO', 'Internal'].includes(user?.position)
                        ? 'cursor-pointer'
                        : ''
                    }
                    onClick={() => {
                      const canEdit =
                        user?.role === 'superadmin' || ['Admin', 'CEO', 'Internal'].includes(user?.position);

                      if (canEdit) {
                        setEditing({ rowId: item.id, field });
                      }
                    }}
                  >
                    {item[field] === '-' ? (
                      <div className="skeleton w-full h-4"></div>
                    ) : item[field] === null || item[field] === '' ? (
                      <span className="italic text-gray-400">Empty</span>
                    ) : (
                      item[field]
                    )}
                  </span>

                )}
              </td>
            ))}

            {/* {user?.role === 'superadmin' && !hasRealData && (
              <td className="border px-3 py-2 text-center print:hidden">
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                />
              </td>
            )} */}
            {(
              user?.role === 'superadmin' ||
              ['Admin', 'CEO', 'Internal'].includes(user?.position)
            ) && !hasRealData && (
              <td className="border px-3 py-2 text-center print:hidden">
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                />
              </td>
            )}

          </tr>
        ))}

        </tbody>
      </table>

      {showAddModal && (
        <div className="modal-add-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-add-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-add-title">Add Constraints Tracker</div>
            {/* { constraintTitle: '', description: '', owner: '', actions: '', status: ''} */}
            {['constraintTitle', 'description', 'owner', 'actions', 'status'].map((field) => (
              <div key={field}>
              {/* <label className="modal-add-label capitalize">{field}</label> */}
              <label className="modal-add-label">{formatLabel(field)}</label>
              {field === 'status' ? (
                <select
                  className="modal-add-input"
                  value={newConstraintsTracker.status}
                  onChange={(e) => setNewConstraintsTracker({ ...newConstraintsTracker, status: e.target.value })}
                >
                  <option value="">Select Status</option>
                  <option>Tracking</option>
                  <option>Behind</option>
                  <option>At Risk</option>
                  <option>Paused</option>
                </select>
              ) : field === 'owner' ? (
                <select
                  className="modal-add-input"
                  value={newConstraintsTracker.owner}
                  onChange={(e) => setNewConstraintsTracker({ ...newConstraintsTracker, owner: e.target.value })}
                >
                  <option value="">Select Owner</option>
                  {users.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              ) : (
                <textarea
                  className="modal-add-input"
                  value={newConstraintsTracker[field]}
                  onChange={(e) => setNewConstraintsTracker({ ...newConstraintsTracker, [field]: e.target.value })}
                />
              )}
            </div>
            ))}
            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAdd}>
                Add
              </button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>

            
            {formError && (
              <p className="text-red-500 text-sm mt-2 text-center">{formError}</p>
            )}
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-add-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-add-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-add-title">Confirm Discard</div>
            <p className="text-gray-700 text-sm mb-4">Are you sure you want to discard all unsaved changes?</p>
            <div className="modal-add-buttons">
              <button className="btn-add" onClick={confirmDischarge}>Yes, Discard</button>
              <button className="btn-close" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstraintsTracker;



