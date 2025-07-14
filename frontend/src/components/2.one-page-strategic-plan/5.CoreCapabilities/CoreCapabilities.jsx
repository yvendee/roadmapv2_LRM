// frontend\src\components\2.one-page-strategic-plan\5.CoreCapabilities\CoreCapabilities.jsx
import React, { useEffect, useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import useCoreCapabilitiesStore, { initialCoreCapabilities } from '../../../store/left-lower-content/2.one-page-strategic-plan/5.coreCapabilitiesStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './CoreCapabilities.css';

const CoreCapabilities = () => {
  const user = useLoginStore((state) => state.user);
  const { coreCapabilities, setCoreCapabilities, pushCoreCapability } = useCoreCapabilitiesStore();

  const [editing, setEditing] = useState({ rowId: null, field: null });
  const [edited, setEdited] = useState([]);
  const [newCapability, setNewCapability] = useState({ description: '', orig: '', q1: '', q2: '', q3: '', q4: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasRealData = coreCapabilities.some(
    (item) =>
      item.description !== '-' ||
      item.orig !== '-' ||
      item.q1 !== '-' ||
      item.q2 !== '-' ||
      item.q3 !== '-' ||
      item.q4 !== '-'
  );

  useEffect(() => {
    const stored = localStorage.getItem('CoreCapabilities');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCoreCapabilities(parsed);
        setEdited(parsed.map((o) => ({ id: o.id })));
      } catch (e) {
        console.error('Invalid CoreCapabilities:', e);
      }
    }
  }, [setCoreCapabilities]);

  const handleBlur = (id, field, value) => {
    const updated = coreCapabilities.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setCoreCapabilities(updated);
    localStorage.setItem('CoreCapabilities', JSON.stringify(updated));
    if (!edited.includes(id)) setEdited([...edited, id]);
    setEditing({ rowId: null, field: null });
  };

  const handleAdd = () => {
    const nextId = Math.max(0, ...coreCapabilities.map((o) => o.id || 0)) + 1;
    const newItem = { id: nextId, ...newCapability };
    pushCoreCapability(newItem);
    localStorage.removeItem('CoreCapabilities');
    setNewCapability({ description: '', orig: '', q1: '', q2: '', q3: '', q4: '' });
    setShowAddModal(false);
    ENABLE_CONSOLE_LOGS && console.log('✅ New CoreCapability Added:', newItem);
  };

  const handleAddCapabilityClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add Strategic Drivers button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  const handleDelete = (id) => {
    const updated = coreCapabilities.filter((item) => item.id !== id);
    setCoreCapabilities(updated);
    localStorage.setItem('CoreCapabilities', JSON.stringify(updated));
    if (!edited.includes(id)) setEdited([...edited, id]);
    ENABLE_CONSOLE_LOGS && console.log(`🗑️ CoreCapability with ID ${id} deleted.`);
  };

  const handleSave = () => {
    setLoadingSave(true);
    setTimeout(() => {
      setLoadingSave(false);
      console.log('📤 Saving CoreCapabilities:', coreCapabilities);
      setEdited([]);
      localStorage.removeItem('CoreCapabilities');
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
    localStorage.removeItem('CoreCapabilities');
    setEdited([]);
    setCoreCapabilities(initialCoreCapabilities);
    setShowConfirmModal(false);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-md font-semibold text-green-700">Core Capabilities / Strengths</h5>
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
              <button className="pure-blue-btn" onClick={handleAddCapabilityClick} disabled={loading}>
                {loading ? <div className="loader-bars"><div></div><div></div><div></div></div> : 'Add Capability'}
              </button>
            )}

          </div>
        )}
      </div>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-50 text-green-700">
          <tr>
            <th className="border px-3 py-2 text-left">Description</th>
            <th className="border px-3 py-2 text-center">Orig</th>
            <th className="border px-3 py-2 text-center">Q1</th>
            <th className="border px-3 py-2 text-center">Q2</th>
            <th className="border px-3 py-2 text-center">Q3</th>
            <th className="border px-3 py-2 text-center">Q4</th>

            {user?.role === 'superadmin' && hasRealData && (
              <th className="border px-3 py-2"></th>
            )}

          </tr>
        </thead>
        <tbody>
          {coreCapabilities.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {/* {['description', 'orig', 'q1', 'q2', 'q3', 'q4'].map((field) => (
                <td key={field} className="border px-3 py-2">
                  {editing.rowId === item.id && editing.field === field ? (
                    <input
                      autoFocus
                      defaultValue={item[field]}
                      onBlur={(e) => handleBlur(item.id, field, e.target.value)}
                      className="w-full border rounded p-1 text-sm"
                    />
                  ) : (
                    <span
                      className={user?.role === 'superadmin' ? 'cursor-pointer' : ''}
                      onClick={() =>
                        user?.role === 'superadmin' && setEditing({ rowId: item.id, field })
                      }
                    >
                      {item[field] || '-'}
                    </span>
                  )}
                </td>
              ))} */}

              {['description', 'orig', 'q1', 'q2', 'q3', 'q4'].map((field) => (
                <td
                  key={field}
                  className={`border px-3 py-2 ${
                    ['orig', 'q1', 'q2', 'q3', 'q4'].includes(field) ? 'text-center' : ''
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
            <div className="modal-add-title">Add Core Capability</div>
            {['description', 'orig', 'q1', 'q2', 'q3', 'q4'].map((field) => (
              <div key={field}>
                <label className="modal-add-label capitalize">{field}</label>
                <input
                  className="modal-add-input"
                  value={newCapability[field]}
                  onChange={(e) => setNewCapability({ ...newCapability, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAdd}>Add</button>
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

export default CoreCapabilities;
