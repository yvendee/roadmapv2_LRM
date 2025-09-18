// frontend\src\components\15.members-departments\1.MembersDepartmentsTable\MembersDepartmentsTable.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import useMembersDepartmentsStore, { initialMembersDepartments } from '../../../store/left-lower-content/15.members-departments/1.membersDepartmentsStore';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './MembersDepartmentsTable.css';

const MembersDepartmentsTable = () => {
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
  // const MembersDepartmentsTable = useMembersDepartmentsStore((state) => state.MembersDepartmentsTable);
  // const setMembersDepartments = useMembersDepartmentsStore((state) => state.setMembersDepartments);
  const updateMembersDepartmentsTableField = useMembersDepartmentsStore((state) => state.updateMembersDepartmentsTableField);
  const pushMembersDepartmentsTableField = useMembersDepartmentsStore((state) => state.pushMembersDepartmentsTableField);
  const { MembersDepartmentsTable, setMembersDepartments } = useMembersDepartmentsStore();


  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMembersDepartmentsTable, setNewMembersDepartmentsTable] = useState({
    name: '',
  });
  

  const [currentOrder, setCurrentOrder] = useState(MembersDepartmentsTable);
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
    const storedData = localStorage.getItem('NewMembersDepartmentsTableData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setMembersDepartments(parsedData);

        ENABLE_CONSOLE_LOGS && console.log('NewMembersDepartmentsTableData found! and  loaded!');


        // ✅ Treat this as unsaved state, trigger the buttons
        setIsEditing(true);


      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Failed to parse NewMembersDepartmentsTableData from localStorage:', err);
      }
    }
  }, [setMembersDepartments]);

  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add Members Departments Table button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  const handleAddNewMembersDepartmentsTable = () => {
    ENABLE_CONSOLE_LOGS && console.log('New Members Departments Table', JSON.stringify(newMembersDepartmentsTable, null, 2));

    // 2. Hide Save / Discharge
    setIsEditing(false);

  
    // 3. Remove localStorage temp data
    localStorage.removeItem('NewMembersDepartmentsTableData');
  
    // 4. Push to Zustand store
    pushMembersDepartmentsTableField(newMembersDepartmentsTable);
  
    // 5. Optionally: force-refresh the UI by resetting store (if needed)
    // Not required unless you deep reset from localStorage elsewhere
  
    // Close modal
    setShowAddModal(false);
  
    // Reset form input
    setNewMembersDepartmentsTable({     
      name: '',
    });

  };

  // const handleAddNewMembersDepartmentsTable = async () => {
  //   const file = newMembersDepartmentsTable?.file;
  //   const uid = useOrganizationUIDStore.getState().uid;
  
  //   try {
  //     let pdflink = '-'; // Default value if no file
  //     let uploadLink = uid ? `/file-upload/${uid}` : '-';
  
  //     // Only upload if file is selected
  //     if (file) {
  //       const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
  //       const isAllowed = allowedExtensions.some((ext) =>
  //         file.name.toLowerCase().endsWith(ext)
  //       );
  
  //       if (!isAllowed) {
  //         alert('Invalid file type.');
  //         return;
  //       }
  
  //       if (file.size > 10 * 1024 * 1024) {
  //         alert('File size must be less than 10MB.');
  //         return;
  //       }
  
  //       // Get CSRF token
  //       const csrfRes = await fetch(`${API_URL}/csrf-token`, {
  //         credentials: 'include',
  //       });
  //       const { csrf_token } = await csrfRes.json();
  
  //       const formData = new FormData();
  //       formData.append('file', file);

  //       if (!uid) {
  //         alert('Organization UID not set.');
  //         return;
  //       }
  
  //       const uploadRes = await fetch(`${API_URL}/file-upload/${uid}`, {
  //         method: 'POST',
  //         headers: {
  //           'X-CSRF-TOKEN': csrf_token,
  //         },
  //         body: formData,
  //         credentials: 'include',
  //       });
  
  //       if (!uploadRes.ok) throw new Error('File upload failed');
  
  //       // Generate pdflink using uploaded file name
  //       const filename = file.name;
  //       uploadLink = `/file-upload/${uid}`;
  //       pdflink = `/api/storage/${uid}/${filename}`;
  //     }
  
  //     // Build clean document object
  //     const { projectName, date, link } = newMembersDepartmentsTable;
  //     const cleanData = {
  //       projectName,
  //       date,
  //       link,
  //       uploadLink,
  //       pdflink,
  //     };
  
  //     console.log('✅ New Members Departments Table:', cleanData);
  
  //     // Update Zustand store
  //     useMembersDepartmentsStore.getState().pushMembersDepartmentsTableField(cleanData);
  
  //     // Reset modal and input state
  //     setShowAddModal(false);
  //     setNewMembersDepartmentsTable({
  //       projectName: '',
  //       date: '',
  //       link: '',
  //       uploadLink: uploadLink,
  //       pdflink: '',
  //     });
  
  //   } catch (error) {
  //     console.error('❌ Upload/Add failed:', error);
  //     alert('Failed to add document.');
  //   }
  // };
  
  
  const handleCellClick = (id, field) => {
    if (loggedUser?.role === 'superadmin') {
      setEditingCell({ id, field });
    }
  };

  const handleInputBlur = (id, field, value) => {
    updateMembersDepartmentsTableField(id, field, value);

    // Update local state for Save/Discharge buttons
    setIsEditing(true);

    // Update localStorage
    const updatedDrivers = MembersDepartmentsTable.map((driver) =>
      driver.id === id ? { ...driver, [field]: value } : driver
    );
    localStorage.setItem('NewMembersDepartmentsTableData', JSON.stringify(updatedDrivers));

    setEditingCell({ id: null, field: null });
  };

  
  // const handleSaveChanges = () => {

  //   setLoadingSave(true);
  
  //   setTimeout(() => {
  //     setLoadingSave(false);
  
  //     const storedData = localStorage.getItem('NewMembersDepartmentsTableData');
  
  //     if (storedData) {
  //       try {
  //         const parsedData = JSON.parse(storedData);
  
  //         // 1. Log to console
  //         ENABLE_CONSOLE_LOGS && console.log('Saved Members Departments Table after Save Changes Button:', parsedData);
  
  //         // 2. Update Zustand store
  //         setMembersDepartments(parsedData);

  //         // Reindex IDs
  //         const reordered = parsedData.map((driver, index) => ({
  //           ...driver,
  //           id: index + 1,
  //         }));

  //         ENABLE_CONSOLE_LOGS &&  console.log('Saved Members Departments Table (Reindexed):', reordered);

  //         setMembersDepartments(reordered);
  
  //         // 3. Clear edited state (hides buttons)
  //         setIsEditing(false);

  
  //         // 4. Remove from localStorage
  //         localStorage.removeItem('NewMembersDepartmentsTableData');
  //       } catch (err) {
  //         ENABLE_CONSOLE_LOGS && console.error('Error parsing NewMembersDepartmentsTableData on save:', err);
  //       }
  //     } else {

  //       // No localStorage changes, use current drag order

  //       const reordered = currentOrder.map((driver, index) => ({
  //         ...driver,
  //         id: index + 1,
  //       }));

  //       ENABLE_CONSOLE_LOGS &&  console.log('Saved Members Departments Table (reordered):', reordered);
  //       setMembersDepartments(reordered);
  //       setIsEditing(false);


  //       // Remove from localStorage
  //       localStorage.removeItem('NewMembersDepartmentsTableData');

  //     }
  //   }, 1000);
  // };

  const handleSaveChanges = () => {
    setLoadingSave(true);
  
    setTimeout(async () => {
      setLoadingSave(false);
  
      const storedData = localStorage.getItem('NewMembersDepartmentsTableData');
  
      let dataToSend;
  
      if (storedData) {
        try {
          dataToSend = JSON.parse(storedData);
          ENABLE_CONSOLE_LOGS && console.log('Saved Members Departments Table after Save Changes Button:', dataToSend);
        } catch (err) {
          ENABLE_CONSOLE_LOGS && console.error('Error parsing NewMembersDepartmentsTableData on save:', err);
          return;
        }
      } else {
        // Fallback: use current order
        dataToSend = currentOrder.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        ENABLE_CONSOLE_LOGS && console.log('Saved Members Departments Table (Reordered):', dataToSend);
      }
  
      try {
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });

        const organization = useLayoutSettingsStore.getState().organization;
  
        const { csrf_token } = await csrfRes.json();
  
        const response = await fetch(`${API_URL}/v1/members-departments/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organizationName: organization,
            membersDepartmentsData: dataToSend,
          }),
        });
  
        const result = await response.json();
        ENABLE_CONSOLE_LOGS && console.log('📤 Update response:', result);
  
        if (!response.ok) {
          console.error('Update failed:', result.message || 'Unknown error');
        } else {
          // ✅ Update Zustand
          setMembersDepartments(dataToSend);
  
          // ✅ Reset UI
          setIsEditing(false);
          localStorage.removeItem('NewMembersDepartmentsTableData');
        }
      } catch (error) {
        console.error('Update request error:', error);
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
    localStorage.removeItem('NewMembersDepartmentsTableData');

    // 2. Clear edited state (hides buttons)
    setIsEditing(false);

    // 3. Update Zustand store
    // setMembersDepartments(initialMembersDepartments);
    const { baselineMembersDepartmentsTable } = useMembersDepartmentsStore.getState();
    // ✅ Console log to inspect baselineMembersDepartmentsTable before setting
    ENABLE_CONSOLE_LOGS &&  console.log('💾 Restoring baselineMembersDepartmentsTable:', baselineMembersDepartmentsTable);
    setMembersDepartments(baselineMembersDepartmentsTable);

    // 4. refresh the table
    setCurrentOrder(baselineMembersDepartmentsTable);

    // 5. Hide Modal
    setShowConfirmModal(false);

  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };


  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(MembersDepartmentsTable);
  }, [MembersDepartmentsTable]);

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
    localStorage.setItem('NewMembersDepartmentsTableData', JSON.stringify(currentOrder));
  
    // Also flag changes for Save/Discharge buttons
    setIsEditing(true);

  
    ENABLE_CONSOLE_LOGS && console.log('Drag ended and saved to localStorage:', currentOrder);
  };

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setMembersDepartments(currentOrder);
    setIsEditing(false);

  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('NewMembersDepartmentsTableData');
    setShowConfirmModal(false);
    setCurrentOrder(MembersDepartmentsTable);
    setIsEditing(false);
  };

  // const isSkeleton = MembersDepartmentsTable.some(driver => 
  //   driver.name === '-'
  //   // driver.name === '-' &&
  //   // driver.status === '-'
  // );

  const isSkeleton = MembersDepartmentsTable.some(driver => 
    Object.values(driver).some(value => value === '-')
  );

  const handleDeleteDriver = (id) => {
    const updated = MembersDepartmentsTable.filter(driver => driver.id !== id);
    setMembersDepartments(updated);
    localStorage.setItem('NewMembersDepartmentsTableData', JSON.stringify(updated));
  
    // Mark as edited
    setIsEditing(true);

  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Members Departments</h5>
        {loggedUser?.role === 'superadmin' && (
          <div className="flex gap-2">

            {isEditing && !isSkeleton && <>
                <button className="pure-green-btn" onClick={handleSaveChanges}>
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
                <button className="pure-red-btn" onClick={handleDischargeChanges}>
                  {loadingDischarge ? (
                    <div className="loader-bars">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    ) : (
                      <>
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                      Discard Changes
                      </>
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
                  Add Department
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
              <th className="border px-4 py-2 ">Name</th>
              {loggedUser?.role === 'superadmin' && !isSkeleton && (
                <th className="border px-4 py-2 text-center"></th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentOrder.map(driver => (
              <tr key={driver.id}
                draggable={
                  !isSkeleton &&  loggedUser?.role === 'superadmin' &&
                  driver.projectName !== '-' &&
                  driver.date !== '-' &&
                  driver.link !== '-' &&
                  driver.viewLink !== '-' &&
                  driver.uploadLink !== '-' &&
                  driver.pdflink !== '-'
                }
                onDragStart={
                  !isSkeleton &&  loggedUser?.role === 'superadmin' &&
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
                  !isSkeleton &&  loggedUser?.role === 'superadmin' &&
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
                  !isSkeleton &&  loggedUser?.role === 'superadmin' &&
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
                  !isSkeleton &&  loggedUser?.role === 'superadmin' &&
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

                {/* name: */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  // onClick={() => driver.name !== '-' && handleCellClick(driver.id, 'name')}
                  onClick={() => !isSkeleton && driver.name !== '-' && handleCellClick(driver.id, 'name')}

                >
                  {driver.name === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'name' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.name}
                      onBlur={(e) => handleInputBlur(driver.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.name
                  )}
                </td>

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
        <div
          className="modal-add-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="modal-add-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-add-title">Add Department Name</div>

            <label className="modal-add-label">Name</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newMembersDepartmentsTable.name}
              onChange={(e) => setNewMembersDepartmentsTable({ ...newMembersDepartmentsTable, name: e.target.value })}
            />

            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAddNewMembersDepartmentsTable}>Add</button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}






    </div>

  );
};

export default MembersDepartmentsTable;
