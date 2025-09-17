// frontend\src\components\14.document-vault\1.DocumentVaultTable\DocumentVaultTable.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import useDocumentVaultStore, { initialDocumentVault } from '../../../store/left-lower-content/14.document-vault/1.documentVaultStore';
import { useOrganizationUIDStore } from '../../../store/layout/organizationUIDStore';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';

import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './DocumentVaultTable.css';

const DocumentVaultTable = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedUploadDriver, setSelectedUploadDriver] = useState(null);
  
  const loggedUser = useLoginStore((state) => state.user);
  // const documentVaultTable = useDocumentVaultStore((state) => state.documentVaultTable);
  // const setDocumentVault = useDocumentVaultStore((state) => state.setDocumentVault);
  const updateDocumentVaultTableField = useDocumentVaultStore((state) => state.updateDocumentVaultTableField);
  const pushDocumentVaultTableField = useDocumentVaultStore((state) => state.pushDocumentVaultTableField);
  const { documentVaultTable, setDocumentVault } = useDocumentVaultStore();


  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocumentVaultTable, setNewDocumentVaultTable] = useState({
    projectName: '',
    date: '',
    link: '',
    pdflink: '',
  });
  

  const [currentOrder, setCurrentOrder] = useState(documentVaultTable);
  const [draggedId, setDraggedId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);


  async function fetchCsrfToken() {
    const response = await fetch(`${API_URL}/csrf-token`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }
    const data = await response.json();
    return data.csrf_token;
  }


  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('DocumentVaultTableData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setDocumentVault(parsedData);

        ENABLE_CONSOLE_LOGS && console.log('DocumentVaultTableData found! and  loaded!');


        // ✅ Treat this as unsaved state, trigger the buttons
        setIsEditing(true);


      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Failed to parse DocumentVaultTableData from localStorage:', err);
      }
    }
  }, [setDocumentVault]);

  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add Document Vault Table button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  const addDocumentVaultToBackend = async (cleanData) => {
    const organization = useLayoutSettingsStore.getState().organization;
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const res = await fetch(`${API_URL}/v1/document-vault/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          cleanData,
        }),
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        console.error('❌ Failed to add document to backend:', result.message);
        return null;
      }
  
      ENABLE_CONSOLE_LOGS && console.log('✅ Backend saved document:', result.newItem);
  
      return result.newItem;
    } catch (error) {
      console.error('❌ Error saving document to backend:', error);
      return null;
    }
  };

  const handleAddNewDocumentVaultTable = async () => {
    const uid = useOrganizationUIDStore.getState().uid;
    const { projectName, date, link } = newDocumentVaultTable;
  
    try {
      if (!uid) {
        alert('Organization UID not set.');
        return;
      }
  
      // ✅ Set pdflink based on UID
      const uploadLink = `file-upload/${uid}`;
      const pdflink = '-';
  
      // Build clean document object
      const cleanData = {
        projectName,
        date,
        link,
        uploadLink,
        pdflink,
      };
  
      ENABLE_CONSOLE_LOGS && console.log('✅ New Document Vault Table (no upload):', cleanData);
  
      // Update Zustand store
      // useDocumentVaultStore.getState().pushDocumentVaultTableField(cleanData);
      if (cleanData?.id) {
        useDocumentVaultStore.getState().pushDocumentVaultTableField(cleanData);
      }
      
  
      // Save to backend
      await addDocumentVaultToBackend(cleanData);
  
      // Reset modal and input state
      setShowAddModal(false);
      setNewDocumentVaultTable({
        projectName: '',
        date: '',
        link: '',
        uploadLink: "",
        pdflink: '',
      });
  
    } catch (error) {
      console.error('❌ Add without upload failed:', error);
      alert('Failed to add document.');
    }
  };

    
  const handleCellClick = (id, field) => {
    if (loggedUser?.role === 'superadmin') {
      setEditingCell({ id, field });
    }
  };

  const handleInputBlur = (id, field, value) => {
    updateDocumentVaultTableField(id, field, value);

    // Update local state for Save/Discharge buttons
    setIsEditing(true);

    // Update localStorage
    const updatedDrivers = documentVaultTable.map((driver) =>
      driver.id === id ? { ...driver, [field]: value } : driver
    );
    localStorage.setItem('DocumentVaultTableData', JSON.stringify(updatedDrivers));

    setEditingCell({ id: null, field: null });
  };

  
  const handleSaveChanges = () => {

    setLoadingSave(true);
  
    setTimeout(() => {
      setLoadingSave(false);
  
      const storedData = localStorage.getItem('DocumentVaultTableData');
  
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
  
          // 1. Log to console
          ENABLE_CONSOLE_LOGS && console.log('Saved Document Vault Table after Save Changes Button:', parsedData);
  
          // 2. Update Zustand store
          setDocumentVault(parsedData);

          // Reindex IDs
          const reordered = parsedData.map((driver, index) => ({
            ...driver,
            id: index + 1,
          }));

          ENABLE_CONSOLE_LOGS &&  console.log('Saved Document Vault Table (Reindexed):', reordered);

          setDocumentVault(reordered);
  
          // 3. Clear edited state (hides buttons)
          setIsEditing(false);

  
          // 4. Remove from localStorage
          localStorage.removeItem('DocumentVaultTableData');
        } catch (err) {
          ENABLE_CONSOLE_LOGS && console.error('Error parsing DocumentVaultTableData on save:', err);
        }
      } else {

        // No localStorage changes, use current drag order

        const reordered = currentOrder.map((driver, index) => ({
          ...driver,
          id: index + 1,
        }));

        ENABLE_CONSOLE_LOGS &&  console.log('Saved Document Vault Table (reordered):', reordered);
        setDocumentVault(reordered);
        setIsEditing(false);


        // Remove from localStorage
        localStorage.removeItem('DocumentVaultTableData');

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

  const confirmDischargeChanges = () => {
    // 1. Remove from localStorage
    localStorage.removeItem('DocumentVaultTableData');

    // 2. Clear edited state (hides buttons)
    setIsEditing(false);

    // 3. Update Zustand store
    setDocumentVault(initialDocumentVault);

    // 4. refresh the table
    setCurrentOrder(documentVaultTable);

    // 5. Hide Modal
    setShowConfirmModal(false);

  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };


  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(documentVaultTable);
  }, [documentVaultTable]);

  // Drag handlers:
  const handleDragStart = (e, id) => {
    setDraggedId(id);
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id === draggedId) return;

    const draggedIndex = currentOrder.findIndex(d => d.id === draggedId);
    const overIndex = currentOrder.findIndex(d => d.id === id);
    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(overIndex, 0, moved);
    setCurrentOrder(newOrder);
    setIsEditing(true);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  
    // Save the new drag order to localStorage
    localStorage.setItem('DocumentVaultTableData', JSON.stringify(currentOrder));
  
    // Also flag changes for Save/Discharge buttons
    setIsEditing(true);

  
    ENABLE_CONSOLE_LOGS && console.log('Drag ended and saved to localStorage:', currentOrder);
  };

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setDocumentVault(currentOrder);
    setIsEditing(false);

  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('DocumentVaultTableData');
    setShowConfirmModal(false);
    setCurrentOrder(documentVaultTable);
    setIsEditing(false);
  };

  const isSkeleton = documentVaultTable.some(driver => 
    driver.description === '-' &&
    driver.status === '-'
  );

  const handleDeleteDriver = (id) => {
    const updated = documentVaultTable.filter(driver => driver.id !== id);
    setDocumentVault(updated);
    localStorage.setItem('DocumentVaultTableData', JSON.stringify(updated));
  
    // Mark as edited
    setIsEditing(true);

  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Document Vault</h5>
        {loggedUser?.role === 'superadmin' && (
          <div className="flex gap-2">

            {isEditing && <>
                <button className="pure-green-btn" onClick={handleSaveChanges}>
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
                <button className="pure-red-btn" onClick={handleDischargeChanges}>
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
            }

            {loggedUser?.role === 'superadmin' && !isSkeleton && (
              <button className="pure-blue-btn ml-2" onClick={handleAddDriverClick} disabled={loading}>
                {loading ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <>
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add Document
                  </>
                )}
              </button>
            )}

          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200">
          <thead>

            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2 ">Project Name</th>
              <th className="border px-4 py-2 ">Date</th>
              <th className="border px-4 py-2 ">Link</th>
              <th className="border px-4 py-2 "></th> {/*<--- view link button -->}*/}
              <th className="border px-4 py-2 "></th> {/*<--- upload button -->}*/}
              <th className="border px-4 py-2 "></th> {/*<--- view pdf button -->}*/}
              {loggedUser?.role === 'superadmin' && !isSkeleton && (
                <th className="border px-4 py-2 text-center"></th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentOrder.map(driver => (
              <tr key={driver.id}
                draggable={
                  loggedUser?.role === 'superadmin' &&
                  driver.projectName !== '-' &&
                  driver.date !== '-' &&
                  driver.link !== '-' &&
                  driver.viewLink !== '-' &&
                  driver.uploadLink !== '-' &&
                  driver.pdflink !== '-'
                }
                onDragStart={
                  loggedUser?.role === 'superadmin' &&
                  driver.projectName !== '-' &&
                  driver.date !== '-' &&
                  driver.link !== '-' &&
                  driver.viewLink !== '-' &&
                  driver.uploadLink !== '-' &&
                  driver.pdflink !== '-'
                    ? (e) => handleDragStart(e, driver.id)
                    : undefined
                }
                onDragOver={
                  loggedUser?.role === 'superadmin' &&
                  driver.projectName !== '-' &&
                  driver.date !== '-' &&
                  driver.link !== '-' &&
                  driver.viewLink !== '-' &&
                  driver.uploadLink !== '-' &&
                  driver.pdflink !== '-'
                    ? (e) => handleDragOver(e, driver.id)
                    : undefined
                }
                onDragEnd={
                  loggedUser?.role === 'superadmin' &&
                  driver.projectName !== '-' &&
                  driver.date !== '-' &&
                  driver.link !== '-' &&
                  driver.viewLink !== '-' &&
                  driver.uploadLink !== '-' &&
                  driver.pdflink !== '-'
                    ? handleDragEnd
                    : undefined
                }
                className={`hover:bg-gray-50 ${
                  loggedUser?.role === 'superadmin' &&
                  driver.projectName !== '-' &&
                  driver.date !== '-' &&
                  driver.link !== '-' &&
                  driver.viewLink !== '-' &&
                  driver.uploadLink !== '-' &&
                  driver.pdflink !== '-'
                    ? 'cursor-move'
                    : 'cursor-default'
                }`}
              >

                {/* Implement skeleton  Loading */}
                
                {/* id */}
                <td className="border px-4 py-3">{isSkeleton ? <div className="skeleton w-6"></div> : driver.id}</td>

                {/* projectName: */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.projectName !== '-' && handleCellClick(driver.id, 'projectName')}
                >
                  {driver.projectName === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'projectName' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.projectName}
                      onBlur={(e) => handleInputBlur(driver.id, 'projectName', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.projectName
                  )}
                </td>


                {/* date */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.date !== '-' && handleCellClick(driver.id, 'date')}
                >
                  {driver.date === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'date' ? (

                    <input
                      type="date"
                      autoFocus
                      defaultValue={driver.date} // ensure it's in YYYY-MM-DD format
                      onBlur={(e) => handleInputBlur(driver.id, 'date', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />

                  ) : (
                    driver.date
                  )}
                </td>

                {/* link */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.link !== '-' && handleCellClick(driver.id, 'link')}
                >
                  {driver.link === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'link' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.link}
                      onBlur={(e) => handleInputBlur(driver.id, 'link', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.link
                  )}
                </td>

                {/* viewLink */}

                <td className="border px-4 py-3 text-center">
                  <button
                    className={`pure-blue-btn ${!driver.link || driver.link === '-' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (driver.link && driver.link !== '-') {
                        window.open(driver.link, '_blank');
                      }
                    }}
                    disabled={!driver.link || driver.link === '-'}
                  >
                    View 
                  </button>
                </td>


                {/* <td className="border px-4 py-3 text-center">
                  <button
                    className="pure-blue-btn"
                    onClick={() => window.open(driver.link, '_blank')}
                  >
                    View
                  </button>
                </td> */}

                {/* <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.viewLink !== '-' && handleCellClick(driver.id, 'viewLink')}
                >
                  {driver.viewLink === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'viewLink' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.viewLink}
                      onBlur={(e) => handleInputBlur(driver.id, 'viewLink', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.viewLink
                  )}
                </td> */}

                {/* uploadLink */}

                {/* upload button */}
                <td className="border px-4 py-3 text-center">
                  <button
                    className="pure-blue-btn"
                    onClick={() => {
                      setSelectedUploadDriver(driver);
                      setUploadError('');
                      setShowUploadModal(true);
                    }}
                  >
                    Upload
                  </button>
                </td>



                {/* <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.uploadLink !== '-' && handleCellClick(driver.id, 'uploadLink')}
                >
                  {driver.uploadLink === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'uploadLink' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.uploadLink}
                      onBlur={(e) => handleInputBlur(driver.id, 'uploadLink', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.uploadLink
                  )}
                </td> */}

                {/* pdflink */}

                <td className="border px-4 py-3 text-center">
                  <button
                    className={`pure-green-btn ${!driver.pdflink || driver.pdflink === '-' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (driver.pdflink && driver.pdflink !== '-') {
                        window.open(driver.pdflink, '_blank');
                      }
                    }}
                    disabled={!driver.pdflink || driver.pdflink === '-'}
                  >
                    Open
                  </button>
                </td>

                {/* <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.pdflink !== '-' && handleCellClick(driver.id, 'pdflink')}
                >
                  {driver.pdflink === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'pdflink' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.pdflink}
                      onBlur={(e) => handleInputBlur(driver.id, 'pdflink', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.pdflink
                  )}
                </td> */}

                {/* delete button */}
                {loggedUser?.role === 'superadmin' && !isSkeleton && (
                  <td className="border px-4 py-3 text-center">
                    <div
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </div>
                  </td>
                )}
                
              </tr>
            ))}
          </tbody>

        </table>
      </div>


      {showConfirmModal && (
        <div className="modal-add-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-add-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-add-title">Confirm Discard</div>
            <p className="text-gray-700 text-sm mb-4">
              Are you sure you want to discard all unsaved changes?
            </p>
            <div className="modal-add-buttons">
              <button className="btn-add" onClick={confirmDischargeChanges}>Yes, Discard</button>
              <button className="btn-close" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}


      {showAddModal && (
        <div className="modal-add-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-add-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-add-title">Add Document</div>

            <label className="modal-add-label">Project Name</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newDocumentVaultTable.projectName}
              onChange={(e) =>
                setNewDocumentVaultTable({
                  ...newDocumentVaultTable,
                  projectName: e.target.value,
                })
              }
            />

            <label className="modal-add-label">Date</label>
            <input
              type="date"
              className="modal-add-input"
              value={newDocumentVaultTable.date}
              onChange={(e) =>
                setNewDocumentVaultTable({
                  ...newDocumentVaultTable,
                  date: e.target.value,
                })
              }
            />

            <label className="modal-add-label">Link</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newDocumentVaultTable.link}
              onChange={(e) =>
                setNewDocumentVaultTable({
                  ...newDocumentVaultTable,
                  link: e.target.value,
                })
              }
            />

            <label className="modal-add-label">Choose a File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="modal-add-input"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const validTypes = [
                  'application/pdf',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'application/vnd.ms-excel',
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ];

                if (!validTypes.includes(file.type)) {
                  alert('Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX.');
                  setNewDocumentVaultTable({
                    ...newDocumentVaultTable,
                    file: null,
                  });
                  return;
                }

                if (file.size > 10 * 1024 * 1024) {
                  alert('File must be less than 10MB.');
                  setNewDocumentVaultTable({
                    ...newDocumentVaultTable,
                    file: null,
                  });
                  return;
                }

                setNewDocumentVaultTable({
                  ...newDocumentVaultTable,
                  file,
                });
              }}
            />

            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAddNewDocumentVaultTable}>
                Add
              </button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="modal-add-overlay">
          <div className="modal-add-box">
            <div className="modal-add-title">Upload File</div>

            {uploadSuccess ? (
              <div className="flex items-center justify-center mt-6 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <>
                <label className="modal-add-label">Choose File</label>
                <input
                  type="file"
                  accept=".pdf,.xls,.xlsx,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const allowedTypes = [
                      'application/pdf',
                      'application/vnd.ms-excel',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/msword',
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ];

                    if (!allowedTypes.includes(file.type)) {
                      setUploadError('Only PDF, Word or Excel files are allowed.');
                      setUploadFile(null);
                      return;
                    }

                    if (file.size > 10 * 1024 * 1024) {
                      setUploadError('File size must be less than 10MB.');
                      setUploadFile(null);
                      return;
                    }

                    setUploadError('');
                    setUploadFile(file);
                  }}
                  className="modal-add-input"
                />
              </>
            )}

            {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}

            {uploading && (
              <div className="loader-bars mt-4">
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}

            <div className="modal-add-buttons">
              {uploadSuccess ? (
                <button
                  className="btn-add"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                    setUploadError('');
                    setUploading(false);
                    setUploadSuccess(false);
                    setSelectedUploadDriver(null);
                  }}
                >
                  OK
                </button>
              ) : (
                <>
                  <button
                    className="btn-close"
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadFile(null);
                      setUploadError('');
                      setUploading(false);
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn-add"
                    disabled={!uploadFile || !!uploadError || uploading}
                    // onClick={async () => {
                    //   if (!uploadFile || !selectedUploadDriver) return;

                    //   setUploading(true);

                    //   const formData = new FormData();
                    //   formData.append('file', uploadFile);

                    //   try {
                    //     // ✅ Fetch CSRF from config-based API_URL
                    //     const csrfRes = await fetch(`${API_URL}/csrf-token`, {
                    //       credentials: 'include',
                    //     });
                    //     const { csrf_token } = await csrfRes.json();

                    //     const response = await fetch(selectedUploadDriver.uploadLink, {
                    //       method: 'POST',
                    //       headers: {
                    //         'X-CSRF-TOKEN': csrf_token,
                    //       },
                    //       credentials: 'include',
                    //       body: formData,
                    //     });

                    //     if (!response.ok) throw new Error('Upload failed.');

                    //     setUploadSuccess(true);

                    //     // Optionally refresh table if needed
                    //     const updatedData = [...documentVaultTable];
                    //     setDocumentVault(updatedData);
                    //   } catch (error) {
                    //     console.error(error);
                    //     setUploadError('Upload failed. Please try again.');
                    //   } finally {
                    //     setUploading(false);
                    //   }
                    // }}

                    // onClick={async () => {
                    //   if (!uploadFile || !selectedUploadDriver) return;
                    
                    //   setUploading(true);
                    
                    //   const formData = new FormData();
                    //   formData.append('file', uploadFile);
                    
                    //   try {
                    //     // ✅ Step 1: Get CSRF token
                    //     const csrfRes = await fetch(`${API_URL}/csrf-token`, {
                    //       credentials: 'include',
                    //     });
                    //     const { csrf_token } = await csrfRes.json();
                    
                    //     // ✅ Step 2: Upload file
                    //     const response = await fetch(`${API_URL}${selectedUploadDriver.uploadLink}`, {
                    //       method: 'POST',
                    //       headers: {
                    //         'X-CSRF-TOKEN': csrf_token,
                    //       },
                    //       credentials: 'include',
                    //       body: formData,
                    //     });
                    
                    //     if (!response.ok) throw new Error('Upload failed.');
                    
                    //     // const result = await response.json();
                    //     const uploadedFileName = uploadFile.name;
                    //     const uploadPath = selectedUploadDriver.uploadLink.replace('/file-upload/', '');
                    //     const newPdfLink = `${API_URL}/storage/${uploadPath}/${uploadedFileName}`;
                    
                    //     // ✅ Step 3: Update pdflink in the correct item
                    //     const updatedData = documentVaultTable.map((doc) =>
                    //       doc.id === selectedUploadDriver.id
                    //         ? { ...doc, pdflink: newPdfLink }
                    //         : doc
                    //     );

                    //     // ✅ Log updated store data
                    //     const updatedStoreData = useDocumentVaultStore.getState().documentVaultTable;
                    //     console.log('📦 Updated Document Vault Store:', updatedStoreData);

                    
                    //     setDocumentVault(updatedData);
                    //     setUploadSuccess(true);
                    
                    //   } catch (error) {
                    //     console.error(error);
                    //     setUploadError('Upload failed. Please try again.');
                    //   } finally {
                    //     setUploading(false);
                    //   }
                    // }}

                    onClick={async () => {
                      if (!uploadFile || !selectedUploadDriver) return;
                    
                      setUploading(true);
                    
                      const formData = new FormData();
                      formData.append('file', uploadFile);
                    
                      try {
                        // ✅ Step 1: Get CSRF token
                        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
                          credentials: 'include',
                        });
                        const { csrf_token } = await csrfRes.json();
                    
                        // ✅ Extract info from selectedUploadDriver
                        const uid = useOrganizationUIDStore.getState().uid;
                        const projectName = selectedUploadDriver?.projectName;
                    
                        if (!uid || !projectName) {
                          throw new Error('Missing UID or project name');
                        }
                    
                        // ✅ Format projectName for URL (lowercase + dash)
                        const formattedProjectName = projectName.toLowerCase().replace(/\s+/g, '-');
                    
                        // ✅ Step 2: Upload file to Laravel route
                        const uploadUrl = `${API_URL}/v1/file-upload/document-vault/${uid}/${formattedProjectName}`;
                    
                        const response = await fetch(uploadUrl, {
                          method: 'POST',
                          headers: {
                            'X-CSRF-TOKEN': csrf_token,
                          },
                          credentials: 'include',
                          body: formData,
                        });
                    
                        if (!response.ok) throw new Error('Upload failed.');
                    
                        const uploadResult = await response.json();
                        const uploadedFileName = uploadFile.name;
                    
                        // ✅ Build correct file path for accessing
                        const pdflink = `${API_URL}/storage/document-vault/${uid}/${formattedProjectName}/${uploadedFileName}`;
                    
                        // ✅ Update table state
                        const updatedData = documentVaultTable.map((doc) =>
                          doc.id === selectedUploadDriver.id
                            ? { ...doc, pdflink }
                            : doc
                        );
                    
                        setDocumentVault(updatedData);
                        setUploadSuccess(true);
                    
                        // ✅ Optional: Debug log
                        ENABLE_CONSOLE_LOGS && console.log('📄 Upload complete:', pdflink);



                        // ✅ After setting pdflink and updating frontend state...
                        try {
                          // ✅ Step 1: Get CSRF token
                          const csrfRes2 = await fetch(`${API_URL}/csrf-token`, {
                            credentials: 'include',
                          });
                          const { csrf_token: csrfToken2 } = await csrfRes2.json();
                        
                          // ✅ Grab organization and itemId
                          const organization = useLayoutSettingsStore.getState().organization;
                          const itemId = selectedUploadDriver.id;
                        
                          if (!organization || !itemId) {
                            throw new Error('Missing organization or itemId');
                          }
                        
                          // ✅ Step 2: Call backend to update PDF link
                          const updateRes = await fetch(`${API_URL}/v1/document-vault/update-pdflink`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json',
                              'X-CSRF-TOKEN': csrfToken2,
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                              organization: organization,
                              itemId: parseInt(itemId, 10), // ensure it's an integer
                              pdflink: pdflink,
                            }),
                          });
                        
                          if (!updateRes.ok) throw new Error('Failed to update pdflink in DB');
                        
                          const updateJson = await updateRes.json();
                          ENABLE_CONSOLE_LOGS && console.log('✅ PDF link updated in DB:', updateJson.message);
                        
                        } catch (err) {
                          console.error('❌ Error saving PDF link to DB:', err);
                        }
                        


                        
                      } catch (error) {
                        console.error(error);
                        setUploadError('Upload failed. Please try again.');
                      } finally {
                        setUploading(false);
                      }

                      
                    }}
                    

                    
                  >
                    Upload
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}






    </div>

  );
};

export default DocumentVaultTable;
