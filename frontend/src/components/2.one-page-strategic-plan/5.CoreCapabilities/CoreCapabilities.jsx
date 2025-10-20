// frontend\src\components\2.one-page-strategic-plan\5.CoreCapabilities\CoreCapabilities.jsx
import React, { useEffect, useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import useCoreCapabilitiesStore, { initialCoreCapabilities } from '../../../store/left-lower-content/2.one-page-strategic-plan/5.coreCapabilitiesStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';

import './CoreCapabilities.css';

const CoreCapabilities = () => {
  const user = useLoginStore((state) => state.user);
  // const { coreCapabilities, setCoreCapabilities, pushCoreCapability } = useCoreCapabilitiesStore();

  const pushCoreCapability = useCoreCapabilitiesStore((state) => state.pushCoreCapability);
  const storeCapabilities = useCoreCapabilitiesStore((state) => state.coreCapabilities);
  const [coreCapabilities, setCoreCapabilities] = useState([]); // Local copy

  const [editing, setEditing] = useState({ rowId: null, field: null });
  const [edited, setEdited] = useState([]);
  const [newCapability, setNewCapability] = useState({ description: '', orig: '', q1: '', q2: '', q3: '', q4: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const organization = useLayoutSettingsStore((state) => state.organization);
 

  const hasRealData = coreCapabilities.some(item => item.value === '-');

  useEffect(() => {
    setCoreCapabilities(storeCapabilities); // Copy from global store once
  }, [storeCapabilities]);


  // const hasRealData = coreCapabilities.some(
  //   (item) =>
  //     item.description !== '-' ||
  //     item.orig !== '-' ||
  //     item.q1 !== '-' ||
  //     item.q2 !== '-' ||
  //     item.q3 !== '-' ||
  //     item.q4 !== '-'
  // );

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

  // const handleBlur = (id, field, value) => {
  //   const updated = coreCapabilities.map((item) =>
  //     item.id === id ? { ...item, [field]: value } : item
  //   );
  //   setCoreCapabilities(updated);
  //   localStorage.setItem('CoreCapabilities', JSON.stringify(updated));
  //   if (!edited.includes(id)) setEdited([...edited, id]);
  //   setEditing({ rowId: null, field: null });
  // };

  const handleBlur = (id, field, value) => {
    let updated;
    if (id === 'header') {
      updated = coreCapabilities.map((item, idx) =>
        idx === 0 ? { ...item, [field]: value } : item
      );
    } else {
      updated = coreCapabilities.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );
    }
  
    setCoreCapabilities(updated);
    localStorage.setItem('CoreCapabilities', JSON.stringify(updated));
  
    if (!edited.includes(id)) {
      setEdited([...edited, id]);
    }
    setEditing({ rowId: null, field: null });
  };
  
  

  // const handleAdd = () => {
  //   const nextId = Math.max(0, ...coreCapabilities.map((o) => o.id || 0)) + 1;
  //   const newItem = { id: nextId, ...newCapability };
  //   pushCoreCapability(newItem);
  //   localStorage.removeItem('CoreCapabilities');
  //   setNewCapability({ description: '', orig: '', q1: '', q2: '', q3: '', q4: '' });
  //   setShowAddModal(false);
  //   ENABLE_CONSOLE_LOGS && console.log('✅ New CoreCapability Added:', newItem);
  // };

  const handleAdd = async () => {
    const nextId = Math.max(0, ...coreCapabilities.map((o) => o.id || 0)) + 1;
    
    // const newItem = { id: nextId, ...newCapability };
    const fallbackCapability = {
      description: newCapability.description?.trim() || 'Untitled Capability',
      orig: newCapability.orig?.trim() || 'N/A',
      q1: newCapability.q1?.trim() || 'TBD',
      q2: newCapability.q2?.trim() || 'TBD',
      q3: newCapability.q3?.trim() || 'TBD',
      q4: newCapability.q4?.trim() || 'TBD',
    };

    const newItem = { id: nextId, ...fallbackCapability };
  
    ENABLE_CONSOLE_LOGS && console.log('📤 Adding CoreCapability:', newItem);
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
  
      const { csrf_token } = await csrfRes.json();
  
      const response = await fetch(`${API_URL}/v1/one-page-strategic-plan/core-capabilities/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          newCapability: newItem,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ New CoreCapability Added:', data.newItem);
        pushCoreCapability(data.newItem); // Update your store
        setEdited([]);
        localStorage.removeItem('CoreCapabilities');
        setNewCapability({ description: '', orig: '', q1: '', q2: '', q3: '', q4: '' });
        setShowAddModal(false);
      } else {
        console.error('❌ Add failed:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Add request error:', error);
    }
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
    setCoreCapabilities(updated); // ONLY updates local UI state
    localStorage.setItem('CoreCapabilities', JSON.stringify(updated));
    if (!edited.includes(id)) setEdited([...edited, id]);
    ENABLE_CONSOLE_LOGS && console.log(`🗑️ CoreCapability with ID ${id} deleted.`);

    // ❌ Don't update the global store
    // useCoreCapabilitiesStore.getState().removeCoreCapability(id); // <--- leave this out
  };

  const handleSave = async () => {
    setLoadingSave(true);
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
  
      const { csrf_token } = await csrfRes.json();

      const response = await fetch(`${API_URL}/v1/one-page-strategic-plan/core-capabilities/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          coreCapabilities,
        }),
      });
  
      const data = await response.json();
  
      setLoadingSave(false);
  
      if (response.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ CoreCapabilities updated:', data);
        setEdited([]);
        localStorage.removeItem('CoreCapabilities');
      } else {
        console.error('❌ Update failed:', data.message || 'Unknown error');
      }
    } catch (error) {
      setLoadingSave(false);
      console.error('❌ Update request error:', error);
    }
  };

  const handleDischargeChanges = () => {
    setLoadingDischarge(true);
    setTimeout(() => {
      setLoadingDischarge(false);
      setShowConfirmModal(true);
    }, 1000);
  };

  // const confirmDischarge = () => {
  //   localStorage.removeItem('CoreCapabilities');
  //   setEdited([]);
  //   setCoreCapabilities(initialCoreCapabilities);
  //   setShowConfirmModal(false);
  // };

  const confirmDischarge = () => {
    localStorage.removeItem('CoreCapabilities');
    setEdited([]);
    const currentState = useCoreCapabilitiesStore.getState().coreCapabilities;
    setCoreCapabilities(currentState); // Use what's in the store, not initial
    setShowConfirmModal(false);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-md font-semibold text-green-700">Core Capabilities / Strengths</h5>
        {user?.role === 'superadmin' && (
          <div className="flex gap-2">
            {(edited.length > 0 || editing.rowId === 'header') && (
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

            {user?.role === 'superadmin' && !hasRealData && (
              <button className="pure-blue-btn print:hidden" onClick={handleAddCapabilityClick} disabled={loading}>
                {loading ? <div className="loader-bars"><div></div><div></div><div></div></div> : 
                <>
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Add Capability
                </>
                }
              </button>
            )}

          </div>
        )}
      </div>

      <table className="min-w-full border border-gray-200 text-sm">
 
        {/* <thead className="bg-gray-50 text-green-700 text-sm">
          <tr>
            <th className="border px-3 py-2">
              <div className="text-left">Description</div>
            </th>
            <th className="border px-3 py-2">
              <div className="flex justify-center items-center">Orig</div>
            </th>
            <th className="border px-3 py-2">
              <div className="flex justify-center items-center">Q1</div>
            </th>
            <th className="border px-3 py-2">
              <div className="flex justify-center items-center">Q2</div>
            </th>
            <th className="border px-3 py-2">
              <div className="flex justify-center items-center">Q3</div>
            </th>
            <th className="border px-3 py-2">
              <div className="flex justify-center items-center">Q4</div>
            </th>

            {user?.role === 'superadmin' && !hasRealData && (
              <th className="border px-3 py-2 print:hidden">
              </th>
            )}

          </tr>
        </thead> */}

        <thead className="bg-gray-50 text-green-700 text-sm">
          <tr>
            {coreCapabilities.length > 0 &&
              ['header1', 'header2', 'header3', 'header4', 'header5', 'header6'].map((headerKey, index) => (
                <th key={headerKey} className="border px-3 py-2">
                  {user?.role === 'superadmin' ? (
                    // <input
                    //   className="w-full border rounded p-1 text-sm"
                    //   value={coreCapabilities[0][headerKey] || ''}
                    //   onChange={(e) => {
                    //     const newHeaderValue = e.target.value;
                    //     const updatedHeaders = { ...coreCapabilities[0], [headerKey]: newHeaderValue };
                    //     const updatedState = [updatedHeaders, ...coreCapabilities.slice(1)];

                    //     setCoreCapabilities(updatedState);
                    //     useCoreCapabilitiesStore.getState().setCoreCapabilities(updatedState);
                    //     localStorage.setItem('CoreCapabilities', JSON.stringify(updatedState));
                    //   }}
                    // />

                    <input
                        className="w-full border rounded p-1 text-sm"
                        value={coreCapabilities[0][headerKey] || ''}
                        onFocus={() => setEditing({ rowId: 'header', field: headerKey })}
                        onChange={(e) => {
                          const newHeaderValue = e.target.value;
                          const updatedHeaders = { ...coreCapabilities[0], [headerKey]: newHeaderValue };
                          const updatedState = [updatedHeaders, ...coreCapabilities.slice(1)];

                          setCoreCapabilities(updatedState);
                          useCoreCapabilitiesStore.getState().setCoreCapabilities(updatedState);
                          localStorage.setItem('CoreCapabilities', JSON.stringify(updatedState));
                        }}
                        onBlur={(e) => handleBlur('header', headerKey, e.target.value)}
                      />

                  ) : (
                    <div className={index === 0 ? 'text-left' : 'text-center'}>
                      {coreCapabilities[0][headerKey]}
                    </div>
                  )}
                </th>
              ))}
            {user?.role === 'superadmin' && !hasRealData && (
              <th className="border px-3 py-2 print:hidden"></th>
            )}
          </tr>
        </thead>

        <tbody>
          {coreCapabilities.slice(1).map((item) => (

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


              {user?.role === 'superadmin' && !hasRealData && (
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

export default CoreCapabilities;
