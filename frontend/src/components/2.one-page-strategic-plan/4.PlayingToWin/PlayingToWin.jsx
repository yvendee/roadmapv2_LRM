// frontend\src\components\one-page-strategic-plan\4.PlayingToWin\PlayingToWin.jsx
import React, { useEffect, useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import usePlayingToWinStore, { initialPlayingToWin } from '../../../store/left-lower-content/2.one-page-strategic-plan/4.playingToWinStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../../configs/config';
import './PlayingToWin.css';
import './RichTextEditor.css';
import RichTextEditor from './RichTextEditor';

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

  // For drag-and-drop
  const [draggedId, setDraggedId] = useState(null);
  const [localOrder, setLocalOrder] = useState(playingtowins);

  // Sync local order from store when no edits
  useEffect(() => {
    if (edited.length === 0) setLocalOrder(playingtowins);
  }, [playingtowins, edited.length]);
  

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


  const markEdited = (id) => {
    if (!edited.includes(id)) setEdited((prev) => [...prev, id]);
  };

  // const handleBlur = (id, field, newValue) => {
  //   const updatedPlayingToWin = playingtowins.map((item) =>
  //     item.id === id ? { ...item, [field]: newValue } : item
  //   );
  //   setPlayingToWin(updatedPlayingToWin);
  //   // localStorage.setItem('PlayingToWin', JSON.stringify(updatedPlayingToWin));
  //   localStorage.setItem('PlayingToWin', JSON.stringify(localOrder));
  //   markEdited(id);
  //   if (!edited.includes(id)) setEdited([...edited, id]);
  //   setEditing({ field: null, id: null });
  // };

  const handleBlur = (id, field, newValue) => {
    updatePlayingToWin(id, field, newValue);
    setLocalOrder((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: newValue } : o)));
    localStorage.setItem('PlayingToWin', JSON.stringify(localOrder));
    markEdited(id);
    setEditing({ field: null, id: null });
  };

  // const handleAdd = () => {
  //   const nextId = Math.max(0, ...playingtowins.map(o => o.id || 0)) + 1;
  //   const newItem = { id: nextId, ...newPlayingToWin };
  //   pushPlayingToWin(newItem);
  //   localStorage.removeItem('PlayingToWin');
  //   setNewPlayingToWin({ title: '', value: '' });
  //   setShowAddModal(false);
  //   markEdited(nextId);
  //   // setEdited([...edited, nextId]);

  //   ENABLE_CONSOLE_LOGS && console.log('✅ New PlayingToWin Added:', newItem);
  //   // console.log('📦 Full Updated PlayingToWin:', [...playingtowins, newItem]);
  // };

  const handleAdd = async () => {
    const nextId = Math.max(0, ...playingtowins.map(o => o.id || 0)) + 1;
    const newItem = { id: nextId, ...newPlayingToWin };
    const organization = useLayoutSettingsStore.getState().organization;
  
    try {
      // Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      // POST new item to backend
      const res = await fetch(`${API_URL}/v1/one-page-strategic-plan/playing-to-win/add`, {
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
  
      const data = await res.json();
  
      if (res.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ New PlayingToWin Added:', data.newItem);
      
        // ✅ Update store
        pushPlayingToWin(data.newItem);
      
        // ✅ Update localOrder to reflect immediately
        setLocalOrder((prev) => [...prev, data.newItem]);
      
        markEdited(data.newItem.id);
        setNewPlayingToWin({ title: '', value: '' });
        setShowAddModal(false);
        localStorage.removeItem('PlayingToWin');
      }
  
    } catch (err) {
      console.error('❌ Error adding new PlayingToWin:', err);
    }
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
    // const updated = playingtowins.filter(o => o.id !== id);
    // setPlayingToWin(updated);
    setPlayingToWin(playingtowins.filter((o) => o.id !== id));
    setLocalOrder((prev) => prev.filter((o) => o.id !== id));
    // localStorage.setItem('PlayingToWin', JSON.stringify(updated));
    // if (!edited.includes(id)) setEdited([...edited, id]);
    localStorage.setItem('PlayingToWin', JSON.stringify(localOrder));
    markEdited(id);

    ENABLE_CONSOLE_LOGS && console.log(`🗑️ PlayingToWin with ID ${id} deleted.`);
    // ENABLE_CONSOLE_LOGS && console.log('📦 Updated PlayingToWins:', updated);
  };

  // const handleSave = () => {

  //   setLoadingSave(true);
  
  //   setTimeout(() => {
  //     setLoadingSave(false);
  //     console.log('📤 Saving to store:', playingtowins);
  //     setEdited([]);
  //     localStorage.removeItem('PlayingToWin');
  //     setPlayingToWin(localOrder);
  //   }, 1000);

  // };

  // const handleSave = () => {
  //   setLoadingSave(true);
  //   setTimeout(() => {
  //     setLoadingSave(false);
  //     setEdited([]);
  //     localStorage.removeItem('PlayingToWin');
  //     ENABLE_CONSOLE_LOGS && console.log('📤 Saving to store:', localOrder);
  //     setPlayingToWin(localOrder);
  //   }, 1000);
  // };

  const handleSave = async () => {
    setLoadingSave(true);
  
    setTimeout(async () => {
      setLoadingSave(false);
      setEdited([]);
      localStorage.removeItem('PlayingToWin');
  
      ENABLE_CONSOLE_LOGS && console.log('📤 Saving to store:', localOrder);
      setPlayingToWin(localOrder);
  
      try {
        // Fetch CSRF token
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
        const { csrf_token } = await csrfRes.json();
  
        const organization = useLayoutSettingsStore.getState().organization;
  
        const res = await fetch(`${API_URL}/v1/one-page-strategic-plan/playing-to-win/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organization,
            playingToWinStrategyData: localOrder,
          }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          ENABLE_CONSOLE_LOGS && console.log('✅ PlayingToWinStrategyData updated:', data);
        } else {
          console.error('❌ Failed to update playingToWinStrategyData:', data.message);
        }
      } catch (err) {
        console.error('❌ Error updating playingToWinStrategyData:', err);
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

  const confirmDischarge = () => {
    localStorage.removeItem('PlayingToWin');
    setEdited([]);
    setLocalOrder(playingtowins);
    setPlayingToWin(initialPlayingToWin);
    setShowConfirmModal(false);
  };

  // Drag-and-drop handlers
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (draggedId === id) return;

    const draggedIndex = localOrder.findIndex((o) => o.id === draggedId);
    const overIndex = localOrder.findIndex((o) => o.id === id);

    if (draggedIndex < 0 || overIndex < 0) return;
    const updated = [...localOrder];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(overIndex, 0, moved);

    setLocalOrder(updated);
    markEdited('reorder');
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    localStorage.setItem('PlayingToWin', JSON.stringify(localOrder));
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
                        'Discard'
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
          {/* {playingtowins.map((item) => ( */}
          {localOrder.map((item) => (
            <div key={item.id} 
              className="relative border rounded-md p-4 shadow-sm bg-white min-h-[100px]"
              draggable={user?.role === 'superadmin' && item.value !== '-'}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragEnd={handleDragEnd}
            >
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
                {/* {editing.field === 'value' && editing.id === item.id ? (
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
                )} */}

                {editing.field === 'value' && editing.id === item.id ? (
                  // Use RichTextEditor for the value field
                  <RichTextEditor
                    value={localOrder.find((o) => o.id === item.id)?.value || ''}
                    onChange={(val) => updatePlayingToWin(item.id, 'value', val)}
                    autoFocus
                    onBlur={(finalHtml) => handleBlur(item.id, 'value', finalHtml)}
                  />
                ) : item.value === '-' ? (
                  <div className="skeleton w-32 h-4"/>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: item.value }} style={{ whiteSpace: 'pre-wrap' }}/>
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
              <div className="modal-add-title">Confirm Discard</div>
              <p className="text-gray-700 text-sm mb-4">
                Are you sure you want to discard all unsaved changes?
              </p>
              <div className="modal-add-buttons">
                <button className="btn-add" onClick={confirmDischarge}>Yes, Discard</button>
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
