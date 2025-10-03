// frontend\src\components\2.one-page-strategic-plan\3.ThreeYearOutlook\ThreeYearOutlook.jsx
import React, { useEffect, useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import useThreeYearOutlookStore, { initialOutlooks } from '../../../store/left-lower-content/2.one-page-strategic-plan/3.threeYearOutlookStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../../configs/config';
import RichTextEditor from './RichTextEditor';
import './ThreeYearOutlook.css';

const ThreeYearOutlook = () => {
  const user = useLoginStore((state) => state.user);
  const { updateOutlook, pushOutlook } = useThreeYearOutlookStore();

  const storeOutlooks = useThreeYearOutlookStore((state) => state.outlooks);
  const [outlooks, setOutlooks] = useState([]);



  const [editing, setEditing] = useState({ field: null, id: null });
  const [edited, setEdited] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOutlook, setNewOutlook] = useState({ year: '', value: '' });

  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasPendingOutlook = outlooks.some(item => item.value === '-');

  // useEffect(() => {
  //   const stored = localStorage.getItem('threeYearOutlook');
  //   if (stored) {
  //     try {
  //       setOutlooks(JSON.parse(stored));
  //     } catch (e) {
  //       console.error('Invalid stored outlooks:', e);
  //     }
  //   }
  // }, [setOutlooks]);

  useEffect(() => {
    setOutlooks(storeOutlooks);
  }, [storeOutlooks]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('threeYearOutlook');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOutlooks(parsed);
        setEdited(parsed.map(o => ({ id: o.id })));
      } catch (e) {
        console.error('Invalid threeYearOutlook:', e);
      }
    }
  }, [setOutlooks]);


  const handleBlur = (id, field, newValue) => {
    const updatedOutlooks = outlooks.map((item) =>
      item.id === id ? { ...item, [field]: newValue } : item
    );
    setOutlooks(updatedOutlooks);
    localStorage.setItem('threeYearOutlook', JSON.stringify(updatedOutlooks));
    if (!edited.includes(id)) setEdited([...edited, id]);
    setEditing({ field: null, id: null });
  };

  // const handleAdd = () => {
  //   const nextId = Math.max(0, ...outlooks.map(o => o.id || 0)) + 1;
  //   const newItem = { id: nextId, ...newOutlook };
  //   pushOutlook(newItem);
  //   localStorage.removeItem('threeYearOutlook');
  //   setNewOutlook({ year: '', value: '' });
  //   setShowAddModal(false);
  //   // setEdited([...edited, nextId]);

  //   ENABLE_CONSOLE_LOGS && console.log('✅ New 3-Year Outlook Added:', newItem);
  //   // console.log('📦 Full Updated Outlooks:', [...outlooks, newItem]);
  // };

  const handleAdd = async () => {
    const nextId = Math.max(0, ...outlooks.map((o) => o.id || 0)) + 1;
    // const newItem = { id: nextId, ...newOutlook };
    const newItem = {
      id: nextId,
      year: newOutlook.year?.trim() ? newOutlook.year : '2025',  // ✅ Default to "2025"
      value: newOutlook.value?.trim() ? newOutlook.value : 'empty', // ✅ Default to "empty"
    };
  
    try {
      ENABLE_CONSOLE_LOGS && console.log('✅ New 3-Year Outlook:', newItem);
  
      // Fetch CSRF Token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const organization = useLayoutSettingsStore.getState().organization;
  
      // Send POST to backend
      const res = await fetch(`${API_URL}/v1/one-page-strategic-plan/three-year-outlook/add`, {
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
        ENABLE_CONSOLE_LOGS && console.log('📤 Added outlook to backend:', data);
  
        // Update local store
        pushOutlook(newItem);
        localStorage.removeItem('threeYearOutlook');
        setNewOutlook({ year: '', value: '' });
        setShowAddModal(false);
      } else {
        console.error('❌ Failed to add new outlook:', data.message);
      }
    } catch (err) {
      console.error('❌ Error adding new outlook:', err);
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
    const updated = outlooks.filter(o => o.id !== id);


    setOutlooks(updated);
    localStorage.setItem('threeYearOutlook', JSON.stringify(updated));
    if (!edited.includes(id)) setEdited([...edited, id]);

    ENABLE_CONSOLE_LOGS && console.log(`🗑️ Outlook with ID ${id} deleted.`);
    // ENABLE_CONSOLE_LOGS && console.log('📦 Updated Outlooks:', updated);
  };



  const handleSave = async () => {
    setLoadingSave(true);
  
    setTimeout(async () => {
      setLoadingSave(false);
  
      try {
        ENABLE_CONSOLE_LOGS && console.log('📤 Saving to store:', outlooks);
  
        // ✅ Step 1: Fetch CSRF Token
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
  
        const { csrf_token } = await csrfRes.json();
  
        // ✅ Step 2: Get organization from store
        const organization = useLayoutSettingsStore.getState().organization;
  
        // ✅ Step 3: Send data to backend
        const res = await fetch(`${API_URL}/v1/one-page-strategic-plan/three-year-outlook/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organization,
            outlooks,
          }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          ENABLE_CONSOLE_LOGS && console.log('✅ Three-Year-Outlook Update API Response:', data);
        } else {
          console.error('❌ Failed to update Three-Year-Outlook:', data.message || data);
        }
  
        // ✅ Step 4: Clear local storage and edited state
        setEdited([]);
        localStorage.removeItem('threeYearOutlook');
  
      } catch (err) {
        console.error('❌ Error saving Three-Year-Outlook:', err);
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
    localStorage.removeItem('threeYearOutlook');
    setEdited([]);
    // ✅ Get current value from Zustand store (not the initial)
    const currentState = useThreeYearOutlookStore.getState().outlooks;
    setOutlooks(currentState);
    setShowConfirmModal(false);
  };
  

  return (

    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="three-year-outlook">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-md font-semibold text-green-700">3 Year Outlook</h5>
          {user?.role === 'superadmin' && (
            <div className="flex gap-2">
              {edited.length > 0 && (
                <>
                 {!storeOutlooks.some((item) => item.title === '-' || item.value === '-') && (
                  <button className="pure-green-btn print:hidden" onClick={handleSave}>
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
                  )}

                  {/* <button className="pure-red-btn" onClick={handleDischargeChanges} disabled={loadingDischarge}>
                    {loadingDischarge ? 'Discharging...' : 'Discharge Changes'}
                  </button> */}

                  <button className="pure-red-btn print:hidden" onClick={handleDischargeChanges} disabled={loadingDischarge} >
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

              {/* <button className="pure-blue-btn" onClick={() => setShowAddModal(true)}>Add</button> */}

              {/* {user?.role === 'superadmin' && !hasPendingOutlook && ( */}
              {user?.role === 'superadmin' && !hasPendingOutlook && !storeOutlooks.some(item => item.title === '-' || item.value === '-') && (

                <button className="pure-blue-btn print:hidden" onClick={handleAddOutlookClick} disabled={loading}>
                  {loading ? (
                    <div className="loader-bars">
                      <div></div><div></div><div></div>
                    </div>
                  ) : (
                    <>
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Add Year Outlook
                    </>
                  )}
                </button>
              )}

            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {outlooks.map((item) => (
            <div key={item.id} className="relative border rounded-md p-4 shadow-sm bg-white min-h-[100px]">
              {/* {user?.role === 'superadmin' && item.value !== '-' &&  ( */}
              { user?.role === 'superadmin' && (item.value === null || item.value !== '-') && (
                <div
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 print:hidden"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </div>
              )}
              
              <h6
                className={`text-sm font-semibold text-gray-800 ${user?.role === 'superadmin' && item.value !== '-' ? 'cursor-pointer' : ''}`}
                onClick={() =>
                  user?.role === 'superadmin' && (item.value === null || item.value !== '-') && setEditing({ field: 'year', id: item.id })
                }
              >
                {item.value === '-' ? (
                  <div className="skeleton w-16 h-5"></div>  // Skeleton for year if value is '-'
                ) : editing.field === 'year' && editing.id === item.id ? (
                  <input
                    autoFocus
                    defaultValue={item.year}
                    onBlur={(e) => handleBlur(item.id, 'year', e.target.value)}
                    className="w-full border p-1 text-sm rounded"
                  />
                ) : (
                  item.year
                )}
              </h6>

              <p
                className={`text-sm text-gray-700 mt-1 ${user?.role === 'superadmin' && item.value !== '-' ? 'cursor-pointer' : ''}`}
                onClick={() =>
                  user?.role === 'superadmin' && (item.value === null || item.value !== '-') && setEditing({ field: 'value', id: item.id })
                  // user?.role === 'superadmin' && setEditing({ field: 'value', id: item.id })

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
                  <RichTextEditor
                    // value={item.value}
                    value={storeOutlooks.find((o) => o.id === item.id)?.value || ''}
                    onChange={(val) => updateOutlook(item.id, 'value', val)}
                    onBlur={(finalHtml) => handleBlur(item.id, 'value', finalHtml)}
                    autoFocus
                  />
                ) : item.value === '-' ? (
                  <div className="skeleton w-32 h-4"></div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: item.value || 'Empty (click to edit)' }} style={{ whiteSpace: 'pre-wrap' }} />
                )}

              </p>

            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="modal-add-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-add-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-add-title">Add Year Outlook</div>
              <label className="modal-add-label">Year</label>
              <input
                className="modal-add-input"
                value={newOutlook.year}
                onChange={(e) => setNewOutlook({ ...newOutlook, year: e.target.value })}
              />
              <label className="modal-add-label">Value</label>
              <textarea
                className="modal-add-input"
                rows="3"
                value={newOutlook.value}
                onChange={(e) => setNewOutlook({ ...newOutlook, value: e.target.value })}
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

export default ThreeYearOutlook;
