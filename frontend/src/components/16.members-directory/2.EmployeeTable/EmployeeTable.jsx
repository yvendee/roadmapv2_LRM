// frontend\src\components\16.members-directory\2.EmployeeTable\EmployeeTable.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import useMembersDepartmentsStore, { initialEmployeeList } from '../../../store/left-lower-content/16.members-directory/1.membersDirectoryStore';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './EmployeeTable.css';

const EmployeeTable = () => {
  const organization = useLayoutSettingsStore.getState().organization;
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });
  const [emailError, setEmailError] = useState('');

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
    fullname: '',
    company: organization || '',
    email: '',
    department: '',
    memberAccess: 'Leadership',
    canLogin: 'Yes',
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

  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(MembersDepartmentsTable);
  }, [MembersDepartmentsTable]);



  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('NewMembersDirectoryTableData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setMembersDepartments(parsedData);

        ENABLE_CONSOLE_LOGS && console.log('NewMembersDirectoryTableData found! and  loaded!');


        // ✅ Treat this as unsaved state, trigger the buttons
        setIsEditing(true);


      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Failed to parse NewMembersDirectoryTableData from localStorage:', err);
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

  // const handleAddNewMembersDepartmentsTable = () => {
  //   ENABLE_CONSOLE_LOGS && console.log('New Members Departments Table', JSON.stringify(newMembersDepartmentsTable, null, 2));

  //   // 2. Hide Save / Discharge
  //   setIsEditing(false);

  
  //   // 3. Remove localStorage temp data
  //   localStorage.removeItem('NewMembersDirectoryTableData');
  
  //   // 4. Push to Zustand store
  //   pushMembersDepartmentsTableField(newMembersDepartmentsTable);
  
  //   // 5. Optionally: force-refresh the UI by resetting store (if needed)
  //   // Not required unless you deep reset from localStorage elsewhere
  
  //   // Close modal
  //   setShowAddModal(false);
  
  //   // Reset form input
  //   setNewMembersDepartmentsTable({     
  //     fullname: '',
  //     company: '',
  //     email: '',
  //     department: '',
  //     memberAccess: '',
  //     canLogin: '',
  //   });

  // };


  // const handleAddNewMembersDepartmentsTable = async () => {
  //   ENABLE_CONSOLE_LOGS && console.log('New Members Directory Table',JSON.stringify(newMembersDepartmentsTable, null, 2));
  
  //   try {
  //     // 1. Get CSRF token
  //     const csrfRes = await fetch(`${API_URL}/csrf-token`, {
  //       credentials: 'include',
  //     });
  //     const { csrf_token } = await csrfRes.json();
  
  //     // 2. Call backend to add new item
  //     const response = await fetch(`${API_URL}/v1/members-directory/add`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-CSRF-TOKEN': csrf_token,
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({
  //         organizationName: organization,
  //         newItem: newMembersDepartmentsTable,
  //       }),
  //     });
  
  //     const result = await response.json();
  
  //     if (!response.ok) {
  //       console.error('❌ Failed to add member:', result.message || 'Unknown error');
  //       alert(result.message || 'Error adding member');
  //       return;
  //     }
  
  //     ENABLE_CONSOLE_LOGS && console.log('✅ New member added:', result.newItem);
  
  //     // 3. Update Zustand store with the newly created item (with ID)
  //     pushMembersDepartmentsTableField(result.newItem);
  
  //     // 4. Reset modal / form
  //     setShowAddModal(false);
  //     setNewMembersDepartmentsTable({
  //       fullname: '',
  //       company: '',
  //       email: '',
  //       department: '',
  //       memberAccess: '',
  //       canLogin: '',
  //     });
  //     localStorage.removeItem('NewMembersDirectoryTableData');
  //     setIsEditing(false);
  
  //   } catch (err) {
  //     console.error('❌ Add request error:', err);
  //     alert('Error occurred while adding new member.');
  //   }
  // };
  

  const handleAddNewMembersDepartmentsTable = async () => {
    ENABLE_CONSOLE_LOGS && console.log('New Members Departments Table', JSON.stringify(newMembersDepartmentsTable, null, 2));
  
    // Validate required fields
    const {
      fullname,
      company,
      email,
      department,
      memberAccess,
      canLogin,
    } = newMembersDepartmentsTable;
  
    if (!fullname?.trim() || !company?.trim() || !email?.trim() || !department?.trim() || !memberAccess?.trim() || !canLogin?.trim()) {
      alert('Please fill all fields.');
      return;
    }
  
    try {
      // 1. Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      // 2. Send POST request to add new member
      const response = await fetch(`${API_URL}/v1/members-directory/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organizationName: organization,
          newItem: {
            fullname: fullname.trim(),
            company: company.trim(),
            email: email.trim(),
            department: department.trim(),
            memberAccess: memberAccess.trim(),
            canLogin: canLogin.trim(),
          },
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('Add failed:', result.message);
        alert(result.message || 'Failed to add member.');
        return;
      }
  
      ENABLE_CONSOLE_LOGS && console.log('✅ New member added:', result.newItem);
  
      // 3. Update local state/store with new member
      pushMembersDepartmentsTableField(result.newItem);
  
      // 4. Reset form/modal
      setShowAddModal(false);
      setNewMembersDepartmentsTable({
        fullname: '',
        company: '',
        email: '',
        department: '',
        memberAccess: '',
        canLogin: '',
      });
      setIsEditing(false);
      localStorage.removeItem('NewMembersDepartmentsTableData');
  
    } catch (err) {
      console.error('❌ Add request error:', err);
      alert('Error occurred while adding member.');
    }
  };
  
  
  
  

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
    localStorage.setItem('NewMembersDirectoryTableData', JSON.stringify(updatedDrivers));

    setEditingCell({ id: null, field: null });
  };

  

  const handleSaveChanges = () => {
    setLoadingSave(true);

    const organization = useLayoutSettingsStore.getState().organization;
  
    setTimeout(async () => {
      try {
        const storedData = localStorage.getItem('NewMembersDirectoryTableData');
  
        let reordered = [];
  
        if (storedData) {
          const parsedData = JSON.parse(storedData);
  
          ENABLE_CONSOLE_LOGS && console.log('📥 Saved Members Directory from localStorage:', parsedData);
  
          reordered = parsedData.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
  
          ENABLE_CONSOLE_LOGS && console.log('📥 Reindexed Members Directory (from localStorage):', reordered);
  
          // Optionally update your Zustand or React state here if needed
          setMembersDepartments(reordered);
        } else {
          // If nothing is in localStorage, use currentOrder
          reordered = currentOrder.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
  
          ENABLE_CONSOLE_LOGS && console.log('📥 Reindexed Members Directory (from currentOrder):', reordered);
  
          // Update state/store if needed
          setMembersDepartments(reordered);
        }
  
        // Cleanup local temp and editing state
        localStorage.removeItem('NewMembersDirectoryTableData');
        setIsEditing(false);
  
        // 🛰️ Push to backend
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
  
        const { csrf_token } = await csrfRes.json();
  
        const response = await fetch(`${API_URL}/v1/members-directory/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organization: organization, // make sure this is defined correctly
            membersDirectoryData: reordered,
          }),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          console.error('❌ Failed to update Members Directory:', result.message || 'Unknown error');
          alert(result.message || 'Update failed');
        } else {
          ENABLE_CONSOLE_LOGS && console.log('✅ Members Directory Update Response:', result);
        }
  
      } catch (err) {
        console.error('❌ Error during save process:', err);
        alert('Something went wrong while saving changes.');
      } finally {
        setLoadingSave(false);
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
    localStorage.removeItem('NewMembersDirectoryTableData');

    // 2. Clear edited state (hides buttons)
    setIsEditing(false);

    // 3. Update Zustand store
    // setMembersDepartments(initialEmployeeList);
    const { baselineMembersDirectoryTable } = useMembersDepartmentsStore.getState();
    // ✅ Console log to inspect baselineMembersDirectoryTable before setting
    ENABLE_CONSOLE_LOGS &&  console.log('💾 Restoring baselineMembersDirectoryTable:', baselineMembersDirectoryTable);
    setMembersDepartments(baselineMembersDirectoryTable);

    // 4. refresh the table
    setCurrentOrder(baselineMembersDirectoryTable);

    // 5. Hide Modal
    setShowConfirmModal(false);

  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };



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
    localStorage.setItem('NewMembersDirectoryTableData', JSON.stringify(currentOrder));
  
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
    localStorage.removeItem('NewMembersDirectoryTableData');
    setShowConfirmModal(false);
    setCurrentOrder(MembersDepartmentsTable);
    setIsEditing(false);
  };

  // const isSkeleton = MembersDepartmentsTable.some(driver => 
  //   driver.fullname === '-' &&
  //   driver.company === '-'
  // );

  const isSkeleton = MembersDepartmentsTable.some(driver => 
    Object.values(driver).some(value => value === '-')
  );

  const handleDeleteDriver = (id) => {
    const updated = MembersDepartmentsTable.filter(driver => driver.id !== id);
    setMembersDepartments(updated);
    localStorage.setItem('NewMembersDirectoryTableData', JSON.stringify(updated));
  
    // Mark as edited
    setIsEditing(true);

  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Members Directory</h5>
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
                  Add
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
              <th className="border px-4 py-2 ">Company</th>
              <th className="border px-4 py-2 ">Email</th>
              <th className="border px-4 py-2 ">Department</th>
              <th className="border px-4 py-2 ">Member Access</th>
              <th className="border px-4 py-2 ">Can Login</th>
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
                  driver.fullname !== '-' &&
                  driver.company !== '-' &&
                  driver.email !== '-' &&
                  driver.department !== '-' &&
                  driver.memberAccess !== '-' &&
                  driver.canLogin !== '-'
                }
                onDragStart={
                  loggedUser?.role === 'superadmin' &&
                  driver.fullname !== '-' &&
                  driver.company !== '-' &&
                  driver.email !== '-' &&
                  driver.department !== '-' &&
                  driver.memberAccess !== '-' &&
                  driver.canLogin !== '-'
                    ? (e) => handleDragStart(e, driver.id)
                    : undefined
                }
                onDragOver={
                  loggedUser?.role === 'superadmin' &&
                  driver.fullname !== '-' &&
                  driver.company !== '-' &&
                  driver.email !== '-' &&
                  driver.department !== '-' &&
                  driver.memberAccess !== '-' &&
                  driver.canLogin !== '-'
                    ? (e) => handleDragOver(e, driver.id)
                    : undefined
                }
                onDragEnd={
                  loggedUser?.role === 'superadmin' &&
                  driver.fullname !== '-' &&
                  driver.company !== '-' &&
                  driver.email !== '-' &&
                  driver.department !== '-' &&
                  driver.memberAccess !== '-' &&
                  driver.canLogin !== '-'
                    ? handleDragEnd
                    : undefined
                }
                className={`hover:bg-gray-50 ${
                  loggedUser?.role === 'superadmin' &&
                  driver.fullname !== '-' &&
                  driver.company !== '-' &&
                  driver.email !== '-' &&
                  driver.department !== '-' &&
                  driver.memberAccess !== '-' &&
                  driver.canLogin !== '-'
                    ? 'cursor-move'
                    : 'cursor-default'
                }`}
              >

                {/* Implement skeleton  Loading */}
                
                {/* id */}
                <td className="border px-4 py-3">{isSkeleton ? <div className="skeleton w-6"></div> : driver.id}</td>

                {/* fullname */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.fullname !== '-' && handleCellClick(driver.id, 'fullname')}
                >
                  {driver.fullname === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'fullname' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.fullname}
                      onBlur={(e) => handleInputBlur(driver.id, 'fullname', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.fullname
                  )}
                </td>


                {/* company */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.company !== '-' && handleCellClick(driver.id, 'company')}
                >
                  {driver.company === '-' ? (
                    <div className="skeleton w-12 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'company' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.company}
                      onBlur={(e) => handleInputBlur(driver.id, 'company', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.company
                  )}
                </td>


                {/* email */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.email !== '-' && handleCellClick(driver.id, 'email')}
                >
                  {driver.email === '-' ? (
                    <div className="skeleton w-12 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'email' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.email}
                      onBlur={(e) => handleInputBlur(driver.id, 'email', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.email
                  )}
                </td>                

                {/* department */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.department !== '-' && handleCellClick(driver.id, 'department')}
                >
                  {driver.department === '-' ? (
                    <div className="skeleton w-12 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'department' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.department}
                      onBlur={(e) => handleInputBlur(driver.id, 'department', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.department
                  )}
                </td>    

                {/* memberAccess */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.memberAccess !== '-' && handleCellClick(driver.id, 'memberAccess')}
                >
                  {driver.memberAccess === '-' ? (
                    <div className="skeleton w-12 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'memberAccess' ? (
                    <select
                      autoFocus
                      value={driver.memberAccess}
                      onBlur={(e) => handleInputBlur(driver.id, 'memberAccess', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      onChange={(e) => handleInputBlur(driver.id, 'memberAccess', e.target.value)}
                    >
                      <option value="Leadership">Leadership</option>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  ) : (
                    driver.memberAccess
                  )}
                </td>

                {/* canLogin */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.canLogin !== '-' && handleCellClick(driver.id, 'canLogin')}
                >
                  {driver.canLogin === '-' ? (
                    <div className="skeleton w-12 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'canLogin' ? (
                    <select
                      autoFocus
                      value={driver.canLogin}
                      onBlur={(e) => handleInputBlur(driver.id, 'canLogin', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      onChange={(e) => handleInputBlur(driver.id, 'canLogin', e.target.value)}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  ) : (
                    driver.canLogin
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
        <div className="modal-add-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-add-box w-[500px] max-h-[600px] bg-white rounded-lg p-5 overflow-y-auto shadow-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-add-title">Add Employee</div>

            <label className="modal-add-label">Name</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newMembersDepartmentsTable.fullname}
              onChange={(e) => setNewMembersDepartmentsTable({ ...newMembersDepartmentsTable, fullname: e.target.value })}
            />

            <label className="modal-add-label">Company</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newMembersDepartmentsTable.company}
              onChange={(e) => setNewMembersDepartmentsTable({ ...newMembersDepartmentsTable, company: e.target.value })}
            />

            {/* <label className="modal-add-label">Email</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newMembersDepartmentsTable.email}
              onChange={(e) => setNewMembersDepartmentsTable({ ...newMembersDepartmentsTable, email: e.target.value })}
            /> */}


            <label className="modal-add-label">Email</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newMembersDepartmentsTable.email}
              onChange={(e) => {
                const email = e.target.value;
                setNewMembersDepartmentsTable({ ...newMembersDepartmentsTable, email });

                // Simple email regex validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                  setEmailError('Please enter a valid email address.');
                } else {
                  setEmailError('');
                }
              }}
            />


            <label className="modal-add-label">Department</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newMembersDepartmentsTable.department}
              onChange={(e) => setNewMembersDepartmentsTable({ ...newMembersDepartmentsTable, department: e.target.value })}
            />

            <label className="modal-add-label">Member Access</label>
            <select
              value={newMembersDepartmentsTable.memberAccess}
              onChange={(e) => setNewMembersDepartmentsTable({ ...newMembersDepartmentsTable, memberAccess: e.target.value })}
              className="modal-add-input"
            >
              <option value="Leadership">Leadership</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            <label className="modal-add-label">Can Login</label>
            <select
              value={newMembersDepartmentsTable.canLogin}
              onChange={(e) => setNewMembersDepartmentsTable({ ...newMembersDepartmentsTable, canLogin: e.target.value })}
              className="modal-add-input"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>



            <div className="modal-add-buttons">

              <button className="btn-add" disabled={!!emailError} onClick={handleAddNewMembersDepartmentsTable}>Add</button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>

            </div>

            {/* 🔻 Error Message BELOW the buttons */}
            {emailError && (
              <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                <span>{emailError}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>

  );
};

export default EmployeeTable;
