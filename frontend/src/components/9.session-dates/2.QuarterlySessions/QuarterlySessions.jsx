// frontend/src/components/9.session-dates/2.QuarterlySessions/QuarterlySessions.jsx
import React, { useState, useEffect } from 'react';
import useLoginStore from '../../../store/loginStore';
import useQuarterlySessionsStore from '../../../store/left-lower-content/9.session-dates/2.quarterlySessionsStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrashAlt, faCheck, faTimes, faPlus, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../../configs/config';
import './QuarterlySessions.css';

const STATUS_OPTIONS = ['Pending', 'Done'];
const getQuarterOptions = () => {
  const year = new Date().getFullYear();
  return [`Q1 ${year}`, `Q2 ${year}`, `Q3 ${year}`, `Q4 ${year}`];
};

const QuarterlySessions = () => {

  const organization = useLayoutSettingsStore((state) => state.organization);
  const loggedUser = useLoginStore((state) => state.user);
  const sessions = useQuarterlySessionsStore((state) => state.sessions);
  const setQuarterlySessions = useQuarterlySessionsStore((state) => state.setQuarterlySessions);
  const updateQuarterlySessionField = useQuarterlySessionsStore((state) => state.updateQuarterlySessionField);
  const addQuarterlySession = useQuarterlySessionsStore((state) => state.addQuarterlySession);

  const [localSessions, setLocalSessions] = useState([...sessions]);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({}); 

  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);

  useEffect(() => {
    setLocalSessions([...sessions]);
  }, [sessions]);

  const handleAddQuarter = () => {
    setLoading(true);
    setTimeout(() => {
      const newItem = {
        status: 'Pending',
        quarter: `Q1 ${new Date().getFullYear()}`,
        meetingDate: '',
        agenda: { name: '-', link: '' },
        recap: { name: '-', link: '' },
      };
      setLocalSessions((prev) => [...prev, newItem]);
      setLoading(false);
    }, 1000);
  };

  // const handleSaveChanges = () => {
  //   setLoadingSave(true);
  //   setTimeout(async () => {
  //     setLoadingSave(false);
  //     setQuarterlySessions(localSessions);
  //     setIsEditing(false);
  //     ENABLE_CONSOLE_LOGS && console.log('Saved sessions to store:', localSessions);
  //   }, 1000);
  // };

  const handleSaveChanges = async () => {
    setLoadingSave(true);
  
    // Step 1: Reindex session IDs
    const reordered = localSessions.map((session, index) => ({
      ...session,
      id: index + 1,
    }));
  
    ENABLE_CONSOLE_LOGS && console.log('📤 Reindexed sessions for update:', reordered);
  
    try {
      // Step 2: Fetch CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      // Step 3: Make POST request to Laravel API
      const response = await fetch(`${API_URL}/v1/session-dates/quarterly-sessions/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organizationName: organization,
          sessionDatesQuarterlySessionsData: reordered,
        }),
      });
  
      const result = await response.json();
      ENABLE_CONSOLE_LOGS && console.log('✅ Server Response:', result);
  
      if (response.ok) {
        setQuarterlySessions(reordered); // Update Zustand store
        setIsEditing(false);
      } else if (response.status === 401) {
        navigate('/', { state: { loginError: 'Session Expired' } });
      } else {
        console.error('❌ Failed to update sessions:', result.message);
      }
  
    } catch (err) {
      console.error('❌ Network/API error:', err);
    }
  
    setLoadingSave(false);
  };

  const handleDiscardChanges = () => {
    setLoadingDischarge(true);
    setTimeout(() => {
      setLocalSessions([...sessions]);
      setIsEditing(false);
      ENABLE_CONSOLE_LOGS && console.log('Discarded changes, restored sessions from store:', sessions);  
      setLoadingDischarge(false);
    }, 1000);
  };

  const handleFieldChange = (idx, field, value) => {
    setLocalSessions((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], [field]: value };
      return arr;
    });
    setIsEditing(true);
  };

  // const handleFileUpload = (idx, field, file) => {
  //   const url = URL.createObjectURL(file);
  //   handleFieldChange(idx, field, { name: file.name, link: url });
  // };


  const allowedExtensions = ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'txt'];

  const handleFileUpload = async (idx, field, file) => {
    if (!file) return;
  
    const fileExt = file.name.split('.').pop().toLowerCase();
  
    if (!allowedExtensions.includes(fileExt)) {
      alert('Invalid file type. Allowed: PDF, DOCX, DOC, XLSX, XLS, TXT.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    // Use localSessions (UI state) instead of sessions from store to get sessionId
    const sessionId = localSessions?.[idx]?.id;
  
    try {
      // Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      // Build URL with parameters
      const uploadUrl = `${API_URL}/v1/session-dates/quarterly-sessions/upload-file/${encodeURIComponent(
        organization
      )}/${field}/${sessionId}`;
  
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: formData,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('Upload failed:', result);
        alert(result.message || 'Upload failed.');
        return;
      }
  
      // Update local UI state first
      setLocalSessions((prev) => {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          [field]: {
            name: result.filename,
            url: result.path, // Use "url" to be consistent with your store
          },
        };
        return updated;
      });
  
      // Also update the Zustand store
      useQuarterlySessionsStore.getState().updateQuarterlySessionField(idx, field, {
        name: result.filename,
        url: result.path,
      });
  
      ENABLE_CONSOLE_LOGS && console.log('✅ File uploaded and state updated:', result);
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert('Upload failed due to network or server error.');
    }
  };
  

  const renderLink = (fileObj) => {
    if (!fileObj || !fileObj.url) {
      return <span>-</span>;
    }
    return (
      <a href={fileObj.url} target="_blank" rel="noopener noreferrer" className="qs-link">
        {fileObj.name}
      </a>
    );
  };

  // function confirmDeleteAgenda(idx, session, updateQuarterlySessionField, setConfirmDelete, setIsEditing) {
  //   ENABLE_CONSOLE_LOGS && console.log(session);
  //   updateQuarterlySessionField(idx, 'agenda', { name: '-', link: '' });
  //   setConfirmDelete(prev => ({ ...prev, [`agenda-${idx}`]: false }));
  // }

  async function confirmDeleteAgenda(
    idx,
    session,
    updateQuarterlySessionField,
    setConfirmDelete,
    setIsEditing,
    localSessions,
    setQuarterlySessions
  ) {
    ENABLE_CONSOLE_LOGS && console.log('🧨 Deleting agenda for session:', session);

    const updatedSession = {
      ...session,
      agenda: { name: '-', link: '' },
    };

    // Immediate UI + store update
    updateQuarterlySessionField(idx, 'agenda', { name: '-', link: '' });
    setConfirmDelete(prev => ({ ...prev, [`agenda-${idx}`]: false }));

    const organization = useLayoutSettingsStore.getState().organization;

    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });

      const { csrf_token } = await csrfRes.json();

      const response = await fetch(`${API_URL}/v1/session-dates/quarterly-sessions/reset-agenda`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organizationName: organization,
          updatedRecord: updatedSession,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        ENABLE_CONSOLE_LOGS && console.log('✅ Agenda reset successfully:', result.data);

        const updatedSessions = localSessions.map((item, i) =>
          i === idx ? updatedSession : item
        );
        setQuarterlySessions(updatedSessions);
      } else {
        console.error('❌ Failed to reset agenda:', result.message);
      }
    } catch (error) {
      console.error('❌ Error resetting agenda:', error);
    }
  }

  
  // function confirmDeleteRecap(idx, session, updateQuarterlySessionField, setConfirmDelete, setIsEditing) {
  //   ENABLE_CONSOLE_LOGS && console.log(session);
  //   updateQuarterlySessionField(idx, 'recap', { name: '-', link: '' });
  //   setConfirmDelete(prev => ({ ...prev, [`recap-${idx}`]: false }));
  // }

  async function confirmDeleteRecap(
    idx,
    session,
    updateQuarterlySessionField,
    setConfirmDelete,
    setIsEditing,
    localSessions,
    setQuarterlySessions
  ) {
    ENABLE_CONSOLE_LOGS && console.log('🧨 Deleting recap for session:', session);
  
    const updatedSession = {
      ...session,
      recap: { name: '-', link: '' },
    };
  
    // Immediate UI + store update
    updateQuarterlySessionField(idx, 'recap', { name: '-', link: '' });
    setConfirmDelete((prev) => ({ ...prev, [`recap-${idx}`]: false }));
  
    const organization = useLayoutSettingsStore.getState().organization;
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
  
      const { csrf_token } = await csrfRes.json();
  
      const response = await fetch(`${API_URL}/v1/session-dates/quarterly-sessions/reset-recap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organizationName: organization,
          updatedRecord: updatedSession,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok && result.status === 'success') {
        ENABLE_CONSOLE_LOGS && console.log('✅ Recap reset successfully:', result.data);
  
        const updatedSessions = localSessions.map((item, i) =>
          i === idx ? updatedSession : item
        );
        setQuarterlySessions(updatedSessions);
      } else {
        console.error('❌ Failed to reset recap:', result.message);
      }
    } catch (error) {
      console.error('❌ Error resetting recap:', error);
    }
  }
  

  const isSuper = loggedUser?.role === 'superadmin';

  // Helper function to check if session.status is empty, null, or '-'
  const isStatusEmpty = (status) => {
    return status === '' || status === null || status === '-';
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      <div className="header-container flex justify-between items-center">
        <h5 className="text-lg font-semibold always-black">Quarterly Sessions</h5>
        {isSuper && !localSessions.some(session => !session.status || session.status === "-") && (
          <div className="flex gap-2">
            {isEditing && (
              <>
                <button className="pure-green-btn" onClick={handleSaveChanges} disabled={loadingSave}>
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
                <button className="pure-red-btn" onClick={handleDiscardChanges} disabled={loadingDischarge}>
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
            <button className="pure-blue-btn ml-2" onClick={handleAddQuarter} disabled={loading}>
              {loading ? (
                <div className="loader-bars">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add
                </>
              )}
            </button>
          </div>
        )}

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200 qs-table">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Quarter</th>
              <th className="border px-4 py-2">Meeting Date</th>
              <th className="border px-4 py-2">Agenda</th>
              <th className="border px-4 py-2">Post Session Recap</th>
            </tr>
          </thead>
          <tbody>
            {localSessions.map((session, idx) => {
              const disabled = isStatusEmpty(session.status);
              if (disabled) {
                // Render skeleton loaders for the whole row
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-4 py-3"><div className="skeleton"></div></td>
                    <td className="border px-4 py-3"><div className="skeleton"></div></td>
                    <td className="border px-4 py-3"><div className="skeleton"></div></td>
                    <td className="border px-4 py-3"><div className="skeleton"></div></td>
                    <td className="border px-4 py-3"><div className="skeleton"></div></td>
                  </tr>
                );
              }
              // Else render normally with inputs/selects enabled
              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-3">
                    {isSuper ? (
                      <select
                        value={session.status}
                        onChange={(e) => handleFieldChange(idx, 'status', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        disabled={disabled}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      session.status || '-'
                    )}
                  </td>

                  <td className="border px-4 py-3">
                    {isSuper ? (
                      <select
                        value={session.quarter}
                        onChange={(e) => handleFieldChange(idx, 'quarter', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        disabled={disabled}
                      >
                        {getQuarterOptions().map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      session.quarter || '-'
                    )}
                  </td>

                  <td className="border px-4 py-3">
                    {isSuper ? (
                      <input
                        type="date"
                        value={session.meetingDate}
                        onChange={(e) => handleFieldChange(idx, 'meetingDate', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        disabled={disabled}
                      />
                    ) : (
                      session.meetingDate || '-'
                    )}
                  </td>

                  <td className="border px-4 py-3">
                    <div className="flex items-center gap-2">
                      {renderLink(session.agenda)}

                      {isSuper && (
                        <>
                          {/* Upload Button */}
                          <button 
                            className="relative inline-flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded"
                            disabled={disabled}
                            title={disabled ? 'Disabled due to empty status' : 'Upload Agenda'}
                          >
                            {!disabled && (
                              <input
                                type="file"
                                onChange={(e) => handleFileUpload(idx, 'agenda', e.target.files[0])}
                                className="opacity-0 absolute w-full h-full cursor-pointer"
                              />
                            )}
                            <FontAwesomeIcon icon={faUpload} className="text-gray-700" />
                          </button>

                          {/* Delete confirmation flow */}
                          {session.agenda?.name && session.agenda.name !== '-' && (
                            <>
                              {confirmDelete[`agenda-${idx}`] ? (
                                <>
                                  {/* Confirm (check) */}
                                  <button
                                    className="w-10 h-10 flex items-center justify-center bg-green-100 hover:bg-green-200 rounded"
                                    // onClick={() => confirmDeleteAgenda(idx, session, updateQuarterlySessionField, setConfirmDelete, setIsEditing)}
                                    onClick={() =>
                                      confirmDeleteAgenda(
                                        idx,
                                        session,
                                        updateQuarterlySessionField,
                                        setConfirmDelete,
                                        setIsEditing,
                                        localSessions,           
                                        setQuarterlySessions     
                                      )
                                    }                                    
                                    title="Confirm Remove"
                                    disabled={disabled}
                                  >
                                    <FontAwesomeIcon icon={faCheck} className="text-green-700" />
                                  </button>
                                  {/* Cancel (times) */}
                                  <button
                                    className="w-10 h-10 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded"
                                    // onClick={() => setConfirmDelete(prev => ({ ...prev, [`agenda-${idx}`]: false }))}
                                    onClick={() =>
                                      confirmDeleteRecap(
                                        idx,
                                        session,
                                        updateQuarterlySessionField,
                                        setConfirmDelete,
                                        setIsEditing,
                                        localSessions,           
                                        setQuarterlySessions     
                                      )
                                    } 
                                    title="Cancel"
                                    disabled={disabled}
                                  >
                                    <FontAwesomeIcon icon={faTimes} className="text-red-700" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="w-10 h-10 flex items-center justify-center bg-red-200 hover:bg-red-300 rounded"
                                  onClick={() => setConfirmDelete(prev => ({ ...prev, [`agenda-${idx}`]: true }))}
                                  title="Remove Agenda"
                                  disabled={disabled}
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} className="text-red-700" />
                                </button>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>

                  <td className="border px-4 py-3">
                    <div className="flex items-center gap-2">
                      {renderLink(session.recap)}

                      {isSuper && (
                        <>
                          {/* Upload Button */}
                          <button 
                            className="relative inline-flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded"
                            disabled={disabled}
                            title={disabled ? 'Disabled due to empty status' : 'Upload Recap'}
                          >
                            {!disabled && (
                              <input
                                type="file"
                                onChange={(e) => handleFileUpload(idx, 'recap', e.target.files[0])}
                                className="opacity-0 absolute w-full h-full cursor-pointer"
                              />
                            )}
                            <FontAwesomeIcon icon={faUpload} className="text-gray-700" />
                          </button>

                          {/* Delete confirmation flow */}
                          {session.recap?.name && session.recap.name !== '-' && (
                            <>
                              {confirmDelete[`recap-${idx}`] ? (
                                <>
                                  {/* Confirm (check) */}
                                  <button
                                    className="w-10 h-10 flex items-center justify-center bg-green-100 hover:bg-green-200 rounded"
                                    onClick={() => confirmDeleteRecap(idx, session, updateQuarterlySessionField, setConfirmDelete, setIsEditing)}
                                    title="Confirm Remove"
                                    disabled={disabled}
                                  >
                                    <FontAwesomeIcon icon={faCheck} className="text-green-700" />
                                  </button>
                                  {/* Cancel (times) */}
                                  <button
                                    className="w-10 h-10 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded"
                                    onClick={() => setConfirmDelete(prev => ({ ...prev, [`recap-${idx}`]: false }))}
                                    title="Cancel"
                                    disabled={disabled}
                                  >
                                    <FontAwesomeIcon icon={faTimes} className="text-red-700" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="w-10 h-10 flex items-center justify-center bg-red-200 hover:bg-red-300 rounded"
                                  onClick={() => setConfirmDelete(prev => ({ ...prev, [`recap-${idx}`]: true }))}
                                  title="Remove Recap"
                                  disabled={disabled}
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} className="text-red-700" />
                                </button>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuarterlySessions;
