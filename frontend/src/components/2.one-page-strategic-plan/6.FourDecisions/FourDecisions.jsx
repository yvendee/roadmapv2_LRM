// frontend\src\components\one-page-strategic-plan\6.FourDecisions\FourDecisions.jsx
import React, { useEffect, useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import useFourDecisions, { initialFourDecisions } from '../../../store/left-lower-content/2.one-page-strategic-plan/6.fourDecisionsStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './FourDecisions.css';

const FourDecisions = () => {
  const user = useLoginStore((state) => state.user);
  const { fourDecisions, setFourDecisions, pushCoreCapability } = useFourDecisions();

  const [editing, setEditing] = useState({ rowId: null, field: null });
  const [edited, setEdited] = useState([]);
  const [newFourDecisions, setNewFourDecisions] = useState({ description: '', orig: '', q1: '', q2: '', q3: '', q4: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasRealData = fourDecisions.some(
    (item) =>
      item.description !== '-' ||
      item.orig !== '-' ||
      item.q1 !== '-' ||
      item.q2 !== '-' ||
      item.q3 !== '-' ||
      item.q4 !== '-'
  );

  useEffect(() => {
    const stored = localStorage.getItem('FourDecisions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFourDecisions(parsed);
        setEdited(parsed.map((o) => ({ id: o.id })));
      } catch (e) {
        console.error('Invalid FourDecisions:', e);
      }
    }
  }, [setFourDecisions]);

  const handleBlur = (id, field, value) => {
    const updated = fourDecisions.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setFourDecisions(updated);
    localStorage.setItem('FourDecisions', JSON.stringify(updated));
    if (!edited.includes(id)) setEdited([...edited, id]);
    setEditing({ rowId: null, field: null });
  };

  const handleAdd = () => {
    const nextId = Math.max(0, ...fourDecisions.map((o) => o.id || 0)) + 1;
    const newItem = { id: nextId, ...newFourDecisions };
    pushCoreCapability(newItem);
    localStorage.removeItem('FourDecisions');
    setNewFourDecisions({ description: '', orig: '', q1: '', q2: '', q3: '', q4: '' });
    setShowAddModal(false);
    ENABLE_CONSOLE_LOGS && console.log('✅ New FourDecisions Added:', newItem);
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
    const updated = fourDecisions.filter((item) => item.id !== id);
    setFourDecisions(updated);
    localStorage.setItem('FourDecisions', JSON.stringify(updated));
    if (!edited.includes(id)) setEdited([...edited, id]);
    ENABLE_CONSOLE_LOGS && console.log(`🗑️ FourDecisions with ID ${id} deleted.`);
  };

  const handleSave = () => {
    setLoadingSave(true);
    setTimeout(() => {
      setLoadingSave(false);
      ENABLE_CONSOLE_LOGS && console.log('📤 Saving FourDecisions:', fourDecisions);
      setEdited([]);
      localStorage.removeItem('FourDecisions');
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
    localStorage.removeItem('FourDecisions');
    setEdited([]);
    setFourDecisions(initialFourDecisions);
    setShowConfirmModal(false);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-md font-semibold text-green-700">4 Decisions</h5>
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
                  ) : 'Discard'}
                </button>
              </>
            )}

            {user?.role === 'superadmin' && hasRealData && (
              <button className="pure-blue-btn" onClick={handleAddDecisionClick} disabled={loading}>
                {loading ? <div className="loader-bars"><div></div><div></div><div></div></div> : 'Add Decisions'}
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
          {fourDecisions.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
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
            <div className="modal-add-title">Add Decision</div>
            {['description', 'orig', 'q1', 'q2', 'q3', 'q4'].map((field) => (
              <div key={field}>
                <label className="modal-add-label capitalize">{field}</label>
                <input
                  className="modal-add-input"
                  value={newFourDecisions[field]}
                  onChange={(e) => setNewFourDecisions({ ...newFourDecisions, [field]: e.target.value })}
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

export default FourDecisions;


