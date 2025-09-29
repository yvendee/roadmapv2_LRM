// frontend/src/components/one-page-strategic-plan/2.FoundationsSection/FoundationsSection.jsx
import React, { useEffect, useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import useFoundationsStore, { initialFoundations } from '../../../store/left-lower-content/2.one-page-strategic-plan/2.foundationsStore';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import API_URL from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './FoundationsSection.css';
import './RichTextEditor.css';
import RichTextEditor from './RichTextEditor';

const FoundationsSection = () => {
  const loggedUser = useLoginStore((state) => state.user);

  const foundations = useFoundationsStore((state) => state.foundations);
  const setFoundations = useFoundationsStore((state) => state.setFoundations);
  const updateFoundationField = useFoundationsStore((state) => state.updateFoundationField);
  const pushFoundation = useFoundationsStore((state) => state.pushFoundation);

  const [editingCell, setEditingCell] = useState({ id: null, field: null });
  const [edited, setEdited] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFoundation, setNewFoundation] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const hasPlaceholder = foundations.some(item => item.title === '-' || item.content === '-');


  // For drag and drop
  const [draggedId, setDraggedId] = useState(null);
  const [localOrder, setLocalOrder] = useState(foundations);

  // Sync local order when store foundations changes, unless user is editing (avoid overwriting)
  useEffect(() => {
    if (edited.length === 0) setLocalOrder(foundations);
  }, [foundations, edited.length]);

  // const [editedFoundations, setEditedFoundations] = useState([]);

  // Load from localStorage
  // useEffect(() => {
  //   const stored = localStorage.getItem('foundationsData');
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       setFoundations(parsed);
  //       setEdited(parsed.map(f => ({ id: f.id })));
  //     } catch (e) {
  //       console.error('Invalid foundationsData:', e);
  //     }
  //   }
  // }, [setFoundations]);

  const handleCellClick = (id, field) => {
    if (loggedUser?.role === 'superadmin') {
      setEditingCell({ id, field });
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('foundationsData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // setFoundations(parsed);            // <- Updates Zustand store
        setLocalOrder(parsed);             // <- Updates local UI state
        setEdited(parsed.map(f => ({ id: f.id }))); // <- Marks everything as "edited"
      } catch (e) {
        console.error('Invalid foundationsData:', e);
      }
    } 
    // else {
    //   setLocalOrder(foundations); // fallback to store
    // }
  }, []);
  

  // const handleInputBlur = (id, field, value) => {
  //   // updateFoundationField(id, field, value);

  //   setEdited(prev => {
  //     if (!prev.some(e => e.id === id)) return [...prev, { id }];
  //     return prev;
  //   });

  //   // Update local order also to reflect changes immediately
  //   setLocalOrder(prev =>
  //     prev.map(f => (f.id === id ? { ...f, [field]: value } : f))
  //   );

  //   const updated = localOrder.map(f =>
  //     f.id === id ? { ...f, [field]: value } : f
  //   );

  //   localStorage.setItem('foundationsData', JSON.stringify(updated));
  //   setEditingCell({ id: null, field: null });
  // };

  const handleInputBlur = (id, field, value) => {
    setEdited(prev => {
      if (!prev.some(e => e.id === id)) return [...prev, { id }];
      return prev;
    });
  
    // Update localOrder only (local UI state)
    setLocalOrder(prev =>
      prev.map(f => (f.id === id ? { ...f, [field]: value } : f))
    );

    const updated = localOrder.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    );

    localStorage.setItem('foundationsData', JSON.stringify(updated));
    setEditingCell({ id: null, field: null });
  };
  

  
  const handleAddFoundationClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // console.log('Add Strategic Drivers button clicked');
      setShowAddModal(true);
    }, 1000);
  };


  const handleAddFoundation = async () => {
    ENABLE_CONSOLE_LOGS && console.log('🆕 New Foundation:', newFoundation);
  
    const updated = [...foundations, newFoundation];
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const organization = useLayoutSettingsStore.getState().organization;
  
      const response = await fetch(`${API_URL}/v1/one-page-strategic-plan/foundations/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          newFoundation,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.status === 'success') {
        ENABLE_CONSOLE_LOGS && console.log('✅ New Foundation Added:', newFoundation);
        ENABLE_CONSOLE_LOGS && console.log('📦 Full Updated Foundations List:', data.updatedData);
  
        // Update store with the new list
        setFoundations(data.updatedData);
      } else {
        console.error('❌ Failed to add new foundation:', data.message);
      }
    } catch (error) {
      console.error('❌ Error adding new foundation:', error);
    }
  
    setNewFoundation({ title: '', content: '' });
    setShowAddModal(false);
    localStorage.removeItem('foundationsData');
    setEdited([]);
  };
  

  const handleSaveChanges = async () => {
    setLoadingSave(true);
  
    setTimeout(async () => {
      setLoadingSave(false);
  
      try {
        // Reindex IDs
        const reordered = localOrder.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
  
        setFoundations(reordered);
  
        ENABLE_CONSOLE_LOGS && console.log('✅ Updated Foundations Saved to Store:', reordered);
  
        // Fetch CSRF token
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
        const { csrf_token } = await csrfRes.json();
  
        const organization = useLayoutSettingsStore.getState().organization;
  
        // Send update to backend
        const res = await fetch(`${API_URL}/v1/one-page-strategic-plan/foundations/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organization,
            foundationsData: reordered,
          }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          ENABLE_CONSOLE_LOGS && console.log('✅ Foundations Update API Response:', data);
        } else {
          console.error('❌ Failed to update foundations:', data.message);
        }
  
        setEdited([]);
        localStorage.removeItem('foundationsData');
  
      } catch (err) {
        console.error('❌ Error parsing or updating foundationsData:', err);
      }
    }, 1000);
  };
  

  // const handleDeleteFoundation = (id) => {
  //   // Remove the foundation with the given id
  //   const updated = foundations.filter(item => item.id !== id);
    
  //   // Update store and localStorage
  //   // setFoundations(updated);
  //   localStorage.setItem('foundationsData', JSON.stringify(updated));

  //   // Update localOrder state for immediate UI update
  //   setLocalOrder(updated);
    
  //   // Add this change to the edited state if not already present, to show save/discard buttons
  //   setEdited(prev => {
  //     if (!prev.some(e => e.id === id)) {
  //       return [...prev, { id }];
  //     }
  //     return prev;
  //   });
    
  //   console.log(`🗑️ Foundation with ID ${id} deleted.`);
  // };
  
  
  
  const handleDeleteFoundation = (idToDelete) => {
    // Step 1: Filter out the deleted item
    const filtered = localOrder.filter(item => item.id !== idToDelete);
  
    // Step 2: Reindex remaining items
    const reindexed = filtered.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
  
    // Step 3: Update both local state and Zustand store
    setLocalOrder(reindexed);
    setFoundations(reindexed); // Ensure Zustand store is synced
  
    // Step 4: Update localStorage
    localStorage.setItem('foundationsData', JSON.stringify(reindexed));
  
    // Step 5: Mark as edited
    setEdited(prev => {
      if (!prev.some(e => e.id === idToDelete)) {
        return [...prev, { id: 'reindex' }];
      }
      return prev;
    });
  
    ENABLE_CONSOLE_LOGS && console.log(`🗑️ Foundation with ID ${idToDelete} deleted and reindexed.`);
  };
  

  const handleDischargeChanges = () => {
    setLoadingDischarge(true);
    setTimeout(() => {
      setLoadingDischarge(false);
      setShowConfirmModal(true);
    }, 1000);
  };

  // const confirmDischarge = () => {
  //   localStorage.removeItem('foundationsData');
  //   setEdited([]);
  //   setFoundations(initialFoundations);
  //   setShowConfirmModal(false);
  // };

  const confirmDischarge = () => {
    localStorage.removeItem('foundationsData');
    setEdited([]);
    // const currentState = useFoundationsStore.getState().foundations;
    // console.log('Resetting foundations to current store state:', currentState);

    const { baselineFoundations } = useFoundationsStore.getState();

    // ✅ Console log to inspect baselineFoundations before setting
    ENABLE_CONSOLE_LOGS &&  console.log('💾 Restoring baselineFoundations:', baselineFoundations);

    setFoundations(baselineFoundations);
    setLocalOrder(baselineFoundations);

    // setLocalOrder(currentState);  // reset local UI state to last saved store state
    setShowConfirmModal(false);
  };

  function unescapeHtml(escapedStr) {
    const doc = new DOMParser().parseFromString(escapedStr, "text/html");
    return doc.documentElement.textContent;
  }

  // Drag and Drop handlers
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id === draggedId) return;

    const draggedIndex = localOrder.findIndex(f => f.id === draggedId);
    const overIndex = localOrder.findIndex(f => f.id === id);

    if (draggedIndex === -1 || overIndex === -1) return;

    const reordered = [...localOrder];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(overIndex, 0, draggedItem);

    setLocalOrder(reordered);

    // Mark edited for reorder action
    if (edited.length === 0) setEdited([{ id: 'reorder' }]);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };


  const handleContentChange = (id, value) => {
    setLocalOrder(prev =>
      prev.map(f => (f.id === id ? { ...f, content: value } : f))
    );
  
    // Mark as edited if not already
    setEdited(prev => (prev.some(e => e.id === id) ? prev : [...prev, { id }]));
  };
  

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold always-black">Foundations</h5>
        {loggedUser?.role === 'superadmin' && (
          <div className="flex gap-2">
            {edited.length > 0 && (
              <>
                <button className="pure-green-btn print:hidden" onClick={handleSaveChanges}>
                  {/* {loadingSave ? 'Saving...' : 'Save Changes'} */}

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
                  {/* {loadingDischarge ? 'Loading...' : 'Discharge Changes'} */}

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

            {/* <button className="pure-blue-btn" onClick={handleAddFoundationClick} disabled={loading}>
              {loading ? (
                <div className="loader-bars">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                'Add Foundation'
              )}
            </button> */}

            {!hasPlaceholder && (
              <button className="pure-blue-btn print:hidden" onClick={handleAddFoundationClick} disabled={loading}>
                {loading ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  // 'Add Foundation'
                  <>
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add Foundation
                  </>
                )}
              </button>
            )}

          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* {foundations.map((item) => {
          const isPlaceholder = item.title === '-' && item.content === '-'; */}
        {localOrder.map((item) => {
          const isPlaceholder = item.title === '-' && item.content === '-';

          return (
            <div key={item.id} 
              className="relative border rounded-md p-4 bg-white shadow-sm min-h-[160px]"
              draggable={loggedUser?.role === 'superadmin' && !isPlaceholder}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragEnd={handleDragEnd}
            >
              {loggedUser?.role === 'superadmin' && !isPlaceholder && (
                <div
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteFoundation(item.id)}
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </div>
              )}

              <h6
                className="text-xs text-green-600 font-semibold mb-2 cursor-pointer"
                onClick={() => handleCellClick(item.id, 'title')}
              >
                {editingCell.id === item.id && editingCell.field === 'title' ? (
                  <input
                    autoFocus
                    type="text"
                    defaultValue={item.title}
                    onBlur={(e) => handleInputBlur(item.id, 'title', e.target.value)}
                    className="w-full px-1 py-0.5 border rounded text-xs"
                  />
                ) : item.title === '-' ? (
                  <div className="skeleton w-32 h-4"></div>
                ) : (
                  item.title
                )}
              </h6>

              

              <p
                className="text-sm whitespace-pre-line text-gray-700 cursor-pointer"
                onClick={() => handleCellClick(item.id, 'content')}
                // onClick={() => {
                //   if (item.content !== '-' && loggedUser?.role === 'superadmin') {
                //     handleCellClick(item.id, 'content');
                //   }
                // }}
              >
                {/* {editingCell.id === item.id && editingCell.field === 'content' ? (
                  <textarea
                    autoFocus
                    rows={3}
                    defaultValue={item.content}
                    onBlur={(e) => handleInputBlur(item.id, 'content', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm resize-none"
                  />
                ) : item.content === '-' ? (
                  <div className="space-y-2">
                    <div className="skeleton w-full h-3"></div>
                    <div className="skeleton w-5/6 h-3"></div>
                  </div>
                ) : (
                  item.content || '\u00A0'
                )} */}

                {editingCell.id === item.id && editingCell.field === 'content' ? (
                  <RichTextEditor
                    // value={foundations.find(f => f.id === item.id)?.content || ''}
                    value={localOrder.find(f => f.id === item.id)?.content || ''}
                    // onChange={(val) => updateFoundationField(item.id, 'content', val)}
                    onChange={(val) => handleContentChange(item.id, val)}
                    
                    autoFocus
                    onBlur={(finalHtml) => handleInputBlur(item.id, 'content', finalHtml)} 
                  />
                ) : item.content === '-' ? (
                  <div className="space-y-2">
                    <div className="skeleton w-full h-3"></div>
                    <div className="skeleton w-5/6 h-3"></div>
                  </div>
                ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: item.content || '\u00A0' }}
                  className="text-sm"
                  style={{ whiteSpace: 'pre-wrap' }}
                />
                )}

              </p>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="modal-add-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-add-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-add-title">Add Foundation</div>
            <label className="modal-add-label">Title</label>
            <input
              className="modal-add-input"
              value={newFoundation.title}
              onChange={(e) => setNewFoundation({ ...newFoundation, title: e.target.value })}
            />
            <label className="modal-add-label">Content</label>
            <textarea
              className="modal-add-input"
              rows="3"
              value={newFoundation.content}
              onChange={(e) => setNewFoundation({ ...newFoundation, content: e.target.value })}
            />
            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAddFoundation}>Add</button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p className="text-lg font-semibold mb-2">Are you sure?</p>
            <p className="text-sm text-gray-600 mb-4">This will discard unsaved changes.</p>
            <div className="modal-buttons">
              <button className="btn-yes" onClick={confirmDischarge}>Yes</button>
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
              <button className="btn-add" onClick={confirmDischarge}>Yes, Discard</button>
              <button className="btn-close" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FoundationsSection;


// ✅ Notes:

// * This component now fully mirrors the behavior of `StrategicDriversTable`.
// * The only difference is that it supports just `title` and `content` per foundation.
// * Drag-and-drop is not included since foundations aren't order-sensitive (but can be added if needed).