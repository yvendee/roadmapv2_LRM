// frontend\src\components\one-page-strategic-plan\7.ConstraintsTracker\ConstraintsTracker.jsx
// import React from 'react';

// const ConstraintsTracker = () => (
//   <div className="p-4 bg-white rounded-lg shadow-md mt-6 overflow-x-auto mr-[15px]">
//     <h5 className="text-sm font-semibold text-green-700 mb-2">Constraints Tracker</h5>
//     <table className="min-w-full border border-gray-200 text-sm">
//       <thead className="bg-gray-50 text-green-700">
//         <tr>
//           <th className="border px-3 py-2">Constraint Title</th>
//           <th className="border px-3 py-2">Description</th>
//           <th className="border px-3 py-2">Owner</th>
//           <th className="border px-3 py-2">Actions</th>
//           <th className="border px-3 py-2">Status</th>
//           <th className="border px-3 py-2"></th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr className="hover:bg-gray-50">
//           <td className="border px-3 py-2" colSpan={6}>&nbsp;</td>
//         </tr>
//       </tbody>
//     </table>
//   </div>
// );

// export default ConstraintsTracker;

import React, { useEffect, useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import useConstraintsTracker, { initialConstraintsTracker } from '../../../store/left-lower-content/2.one-page-strategic-plan/7.constraintsTrackerStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './ConstraintsTracker.css';

const ConstraintsTracker = () => {
  const user = useLoginStore((state) => state.user);
  const { constraintsTracker, setConstraintsTracker, pushConstraintsTracker } = useConstraintsTracker();

  const [editing, setEditing] = useState({ rowId: null, field: null });
  const [edited, setEdited] = useState([]);
  const [newConstraintsTracker, setNewConstraintsTracker] = useState({ constraintTitle: '', description: '', owner: '', actions: '', status: ''});
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasRealData = constraintsTracker.some(
    (item) =>
      item.constraintTitle !== '-' ||
      item.description !== '-' ||
      item.owner !== '-' ||
      item.actions !== '-' ||
      item.status !== '-'
  );

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

  const handleBlur = (id, field, value) => {
    const updated = constraintsTracker.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setConstraintsTracker(updated);
    localStorage.setItem('ConstraintsTracker', JSON.stringify(updated));
    if (!edited.includes(id)) setEdited([...edited, id]);
    setEditing({ rowId: null, field: null });
  };

  const handleAdd = () => {
    const nextId = Math.max(0, ...constraintsTracker.map((o) => o.id || 0)) + 1;
    const newItem = { id: nextId, ...newConstraintsTracker };
    pushConstraintsTracker(newItem);
    localStorage.removeItem('ConstraintsTracker');
    setNewConstraintsTracker({ constraintTitle: '', description: '', owner: '', actions: '', status: ''});
    setShowAddModal(false);
    ENABLE_CONSOLE_LOGS && console.log('✅ New Constraints Tracker Added:', newItem);
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

  const handleSave = () => {
    setLoadingSave(true);
    setTimeout(() => {
      setLoadingSave(false);
      console.log('📤 Saving Constraints Tracker:', constraintsTracker);
      setEdited([]);
      localStorage.removeItem('ConstraintsTracker');
    }, 1000);
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
    setConstraintsTracker(initialConstraintsTracker);
    setShowConfirmModal(false);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-md font-semibold text-green-700">Constraints Tracker</h5>
        {user?.role === 'superadmin' && (
          <div className="flex gap-2">
            {edited.length > 0 && (
              <>
                <button className="pure-green-btn" onClick={handleSave}>
                  {loadingSave ? (
                    <div className="loader-bars"><div></div><div></div><div></div></div>
                  ) : 'Save Changes'}
                </button>
                <button className="pure-red-btn" onClick={handleDischargeChanges} disabled={loadingDischarge}>
                  {loadingDischarge ? (
                    <div className="loader-bars"><div></div><div></div><div></div></div>
                  ) : 'Discharge Changes'}
                </button>
              </>
            )}

            {user?.role === 'superadmin' && hasRealData && (
              <button className="pure-blue-btn" onClick={handleAddDecisionClick} disabled={loading}>
                {loading ? <div className="loader-bars"><div></div><div></div><div></div></div> : 'Add Constraints Tracker'}
              </button>
            )}

          </div>
        )}
      </div>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-50 text-green-700">
          <tr>
            <th className="border px-3 py-2 text-left">Constraint Title</th>
            <th className="border px-3 py-2 text-center">Description</th>
            <th className="border px-3 py-2 text-center">Owner</th>
            <th className="border px-3 py-2 text-center">Actions</th>
            <th className="border px-3 py-2 text-center">Status</th>
            
            {user?.role === 'superadmin' && hasRealData && (
              <th className="border px-3 py-2 text-center"></th>
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
                    <input
                      autoFocus
                      defaultValue={item[field]}
                      onBlur={(e) => handleBlur(item.id, field, e.target.value)}
                      className="w-full border rounded p-1 text-sm"
                    />
                  ) : item[field] === '-' ? (
                    <div className="skeleton w-full h-4"></div>
                  ) : (
                    <span
                      className={user?.role === 'superadmin' ? 'cursor-pointer' : ''}
                      onClick={() =>
                        user?.role === 'superadmin' && setEditing({ rowId: item.id, field })
                      }
                    >
                      {item[field]}
                    </span>
                  )}
                </td>
              ))}



              {/* <td className="border px-3 py-2 text-center">
                {user?.role === 'superadmin' && (
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleDelete(item.id)}
                  />
                )}
              </td> */}

              {user?.role === 'superadmin' && hasRealData && (
                <td className="border px-3 py-2 text-center">
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
            {['Constraint Title', 'description', 'owner', 'actions', 'status'].map((field) => (
              <div key={field}>
                <label className="modal-add-label capitalize">{field}</label>
                <input
                  className="modal-add-input"
                  value={newConstraintsTracker[field]}
                  onChange={(e) => setNewConstraintsTracker({ ...newConstraintsTracker, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAdd}>
                Add
              </button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-add-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-add-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-add-title">Confirm Discharge</div>
            <p className="text-gray-700 text-sm mb-4">Are you sure you want to discard all unsaved changes?</p>
            <div className="modal-add-buttons">
              <button className="btn-add" onClick={confirmDischarge}>Yes, Discharge</button>
              <button className="btn-close" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstraintsTracker;



