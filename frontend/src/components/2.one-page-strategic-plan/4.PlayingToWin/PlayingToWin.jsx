// frontend\src\components\one-page-strategic-plan\4.PlayingToWin\PlayingToWin.jsx
import React, { useEffect, useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import usePlayingToWinStore, { initialPlayingToWin } from '../../../store/left-lower-content/2.one-page-strategic-plan/4.playingToWinStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './PlayingToWin.css';

const PlayingToWin = () => {
  const user = useLoginStore((state) => state.user);
  const { playingtowins, setPlayingToWin, updatePlayingToWin, pushPlayingToWin } = usePlayingToWinStore();

  const [editing, setEditing] = useState({ field: null, id: null });
  const [edited, setEdited] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlayingToWin, setNewPlayingToWin] = useState({ title: '', value: '' });

  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasPlayingToWin = playingtowins.some(item => item.value === '-');

  // useEffect(() => {
  //   const stored = localStorage.getItem('PlayingToWin');
  //   if (stored) {
  //     try {
  //       setPlayingToWin(JSON.parse(stored));
  //     } catch (e) {
  //       console.error('Invalid stored playingtowins:', e);
  //     }
  //   }
  // }, [setPlayingToWin]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('PlayingToWin');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPlayingToWin(parsed);
        setEdited(parsed.map(o => ({ id: o.id })));
      } catch (e) {
        console.error('Invalid PlayingToWin:', e);
      }
    }
  }, [setPlayingToWin]);


  const handleBlur = (id, field, newValue) => {
    const updatedPlayingToWin = playingtowins.map((item) =>
      item.id === id ? { ...item, [field]: newValue } : item
    );
    setPlayingToWin(updatedPlayingToWin);
    localStorage.setItem('PlayingToWin', JSON.stringify(updatedPlayingToWin));
    if (!edited.includes(id)) setEdited([...edited, id]);
    setEditing({ field: null, id: null });
  };

  const handleAdd = () => {
    const nextId = Math.max(0, ...playingtowins.map(o => o.id || 0)) + 1;
    const newItem = { id: nextId, ...newPlayingToWin };
    pushPlayingToWin(newItem);
    localStorage.removeItem('PlayingToWin');
    setNewPlayingToWin({ title: '', value: '' });
    setShowAddModal(false);
    // setEdited([...edited, nextId]);

    ENABLE_CONSOLE_LOGS && console.log('✅ New PlayingToWin Added:', newItem);
    // console.log('📦 Full Updated PlayingToWin:', [...playingtowins, newItem]);
  };

  const handleAddOutlookClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add Strategic Drivers button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  const handleDelete = (id) => {
    const updated = playingtowins.filter(o => o.id !== id);
    setPlayingToWin(updated);
    localStorage.setItem('PlayingToWin', JSON.stringify(updated));
    if (!edited.includes(id)) setEdited([...edited, id]);

    ENABLE_CONSOLE_LOGS && console.log(`🗑️ PlayingToWin with ID ${id} deleted.`);
    // ENABLE_CONSOLE_LOGS && console.log('📦 Updated PlayingToWins:', updated);
  };

  const handleSave = () => {

    setLoadingSave(true);
  
    setTimeout(() => {
      setLoadingSave(false);

      console.log('📤 Saving to store:', playingtowins);
      setEdited([]);
      localStorage.removeItem('PlayingToWin');
  
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
    localStorage.removeItem('PlayingToWin');
    setEdited([]);
    setPlayingToWin(initialPlayingToWin);
    setShowConfirmModal(false);
  };
  

  return (

    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="playing-to-win">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-md font-semibold text-green-700">Playing to Win Strategy</h5>
          {user?.role === 'superadmin' && (
            <div className="flex gap-2">
              {edited.length > 0 && (
                <>
                  {/* <button className="pure-green-btn" onClick={handleSave}>Save Changes</button> */}
                  <button className="pure-green-btn" onClick={handleSave}>
                    {/* {loadingSave ? 'Saving...' : 'Save Changes'} */}

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
                  {/* <button className="pure-red-btn" onClick={handleDischargeChanges} disabled={loadingDischarge}>
                    {loadingDischarge ? 'Discharging...' : 'Discharge Changes'}
                  </button> */}

                  <button className="pure-red-btn" onClick={handleDischargeChanges} disabled={loadingDischarge} >
                    {/* {loadingDischarge ? 'Loading...' : 'Discharge Changes'} */}

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

              {/* <button className="pure-blue-btn" onClick={() => setShowAddModal(true)}>Add</button> */}

              {user?.role === 'superadmin' && !hasPlayingToWin && (
                <button className="pure-blue-btn" onClick={handleAddOutlookClick} disabled={loading}>
                  {loading ? (
                    <div className="loader-bars">
                      <div></div><div></div><div></div>
                    </div>
                  ) : (
                    'Add Playing to Win Strategy'
                  )}
                </button>
              )}

            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playingtowins.map((item) => (
            <div key={item.id} className="relative border rounded-md p-4 shadow-sm bg-white min-h-[100px]">
              {user?.role === 'superadmin' && item.value !== '-' &&  (
                <div
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </div>
              )}
              
              <h6
                className={`text-sm font-semibold text-gray-800 ${user?.role === 'superadmin' && item.value !== '-' ? 'cursor-pointer' : ''}`}
                onClick={() =>
                  user?.role === 'superadmin' && item.value !== '-' && setEditing({ field: 'title', id: item.id })
                }
              >
                {item.value === '-' ? (
                  <div className="skeleton w-16 h-5"></div>  // Skeleton for title if value is '-'
                ) : editing.field === 'title' && editing.id === item.id ? (
                  <input
                    autoFocus
                    defaultValue={item.title}
                    onBlur={(e) => handleBlur(item.id, 'title', e.target.value)}
                    className="w-full border p-1 text-sm rounded"
                  />
                ) : (
                  item.title
                )}
              </h6>

              <p
                className={`text-sm text-gray-700 mt-1 ${user?.role === 'superadmin' && item.value !== '-' ? 'cursor-pointer' : ''}`}
                onClick={() =>
                  user?.role === 'superadmin' && item.value !== '-' && setEditing({ field: 'value', id: item.id })
                }
              >
                {editing.field === 'value' && editing.id === item.id ? (
                  <textarea
                    autoFocus
                    defaultValue={item.value}
                    onBlur={(e) => handleBlur(item.id, 'value', e.target.value)}
                    className="w-full border p-1 text-sm rounded"
                    rows="3"
                  />
                ) : item.value === '-' ? (
                  <div className="skeleton w-32 h-4"></div>
                ) : (
                  item.value
                )}
              </p>

            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="modal-add-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-add-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-add-title">Add Playing to Win Strategy</div>
              <label className="modal-add-label">title</label>
              <input
                className="modal-add-input"
                value={newPlayingToWin.title}
                onChange={(e) => setNewPlayingToWin({ ...newPlayingToWin, title: e.target.value })}
              />
              <label className="modal-add-label">Value</label>
              <textarea
                className="modal-add-input"
                rows="3"
                value={newPlayingToWin.value}
                onChange={(e) => setNewPlayingToWin({ ...newPlayingToWin, value: e.target.value })}
              />
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
              <p className="text-gray-700 text-sm mb-4">
                Are you sure you want to discard all unsaved changes?
              </p>
              <div className="modal-add-buttons">
                <button className="btn-add" onClick={confirmDischarge}>Yes, Discharge</button>
                <button className="btn-close" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>

  );
};

export default PlayingToWin;
