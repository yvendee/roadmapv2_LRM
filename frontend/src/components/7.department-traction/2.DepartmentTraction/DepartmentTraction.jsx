// frontend\src\components\7.department-traction\2.DepartmentTraction\DepartmentTraction.jsx
import React, { useState, useEffect } from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSyncAlt,
  faCommentDots,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import useDepartmentTractionStore, { initialDepartmentTraction } from '../../../store/left-lower-content/7.department-traction/2.departmentTractionStore';
import { useCompanyTractionUserStore } from '../../../store/layout/companyTractionUserStore';
import useActivityLogStore from '../../../store/left-lower-content/7.department-traction/3.activityLogStore';
import useDepartmentAnnualPrioritiesStore from '../../../store/left-lower-content/7.department-traction/1.departmentAnnualPrioritiesStores';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import './DepartmentTraction.css';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const DepartmentTractionTable = () => {

  const organization = useLayoutSettingsStore.getState().organization;
  const activityLogs = useActivityLogStore((state) => state.activityLogs);
  const [showLogs, setShowLogs] = useState(false);
  const toggleActivityLog = () => setShowLogs(prev => !prev);


  const [addTractionModalOpen, setAddTractionModalOpen] = useState(false);
  const [form, setForm] = useState({
    annualPriority: '',
    quarter: 'Q1',
    who: '',
    collaborator: '',
    progress: '0%',
    description: '',
    dueDate: '',
    rank: '',
  });


  const addDepartmentTraction = useDepartmentTractionStore((state) => state.addDepartmentTraction);

  const departmentAnnualPriorities = useDepartmentAnnualPrioritiesStore((state) => state.departmentAnnualPriorities);

  const { departmentTraction, setDepartmentTraction, updatedDepartmentTraction  } = useDepartmentTractionStore();

  const loggedUser = useLoginStore((state) => state.user);
  const isSuperAdmin = loggedUser?.role === 'superadmin'; // Check if the user is a superadmin

  const { users, selectedUser, setUsers, setSelectedUser } = useCompanyTractionUserStore();

  // const storeData = useDepartmentTractionStore((state) => state.departmentTraction);
  const updateDepartmentTractionField = useDepartmentTractionStore(
    (state) => state.updateDepartmentTractionField
  );

  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // const [activeQuarter, setActiveQuarter] = useState('Q2');
  const [activeQuarter, setActiveQuarter] = useState(() => {
    return localStorage.getItem('activeQuarter') || 'Q1';
  });

  // useEffect(() => {
  //   localStorage.setItem('activeQuarter', activeQuarter);
  // }, [activeQuarter]);

  
  useEffect(() => {
    async function fetchQuarterFromServer() {
      try {
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
        const { csrf_token } = await csrfRes.json();
  
        const res = await fetch(`${API_URL}/v1/company-traction/get-current-quarter`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({ organizationName: organization }),
        });
  
        const data = await res.json();
  
        if (res.ok && data.quarter) {
          setActiveQuarter(data.quarter);
          localStorage.setItem('activeQuarter', data.quarter);
        } else {
          console.warn('Fallback to Q1 due to missing/invalid quarter');
          setActiveQuarter('Q1');
          localStorage.setItem('activeQuarter', 'Q1');
        }
      } catch (error) {
        console.error('Failed to fetch current quarter:', error);
        setActiveQuarter('Q1');
        localStorage.setItem('activeQuarter', 'Q1');
      }
    }
  
    // ✅ Always fetch, no conditional check
    fetchQuarterFromServer();
  
  }, [organization]);
  
  
  const [showCompleted, setShowCompleted] = useState(true);


  // Generate progress options from 0% to 100% with increments of 5%
  const progressOptions = [];
  for (let i = 0; i <= 100; i += 5) {
    progressOptions.push(`${i}%`);
  }

  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // To store the selected item for comment


  const [description, setDescription] = useState('');
  const [annualPriority, setAnnualPriority] = useState('');
  const [rank, setRank] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const [editingProgress, setEditingProgress] = useState(null); 
  const [editingCell, setEditingCell] = useState({ rowId: null, field: null });
  const [editingRank, setEditingRank] = useState(null); // For tracking which row is being edited


  const filteredRows = showCompleted
    ? departmentTraction[activeQuarter] || []
    : (departmentTraction[activeQuarter] || []).filter((row) => row.progress !== '100%');


  useEffect(() => {
    console.log('useEffect mounted: checking localStorage for departmentTractionData');
    const storedData = localStorage.getItem('departmentTractionData');
    if (storedData) {
      console.log('Found storedData:', storedData);
      setIsEditing(true); // Mark as edited
      try {
        // setData(JSON.parse(storedData));
        setDepartmentTraction(JSON.parse(storedData));
      } catch (e) {
        console.error('Failed to parse departmentTractionData from localStorage', e);
        // setData(storeData);
      }
    } 
  }, []);
  




  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const postedDate = new Date(timestamp);
    const seconds = Math.floor((now - postedDate) / 1000);
  
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];
  
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  const handleAddComment = () => {
    setIsEditing(true); // Mark as edited
    if (newComment && selectedItem) {
      const updatedCompanyTraction = { ...departmentTraction };
  
      const newCommentData = {
        author: loggedUser?.fullname || 'Anonymous',
        message: newComment,
        posted: new Date().toISOString(), // Save full timestamp
      };
  
      updatedCompanyTraction[activeQuarter] = updatedCompanyTraction[activeQuarter].map(item =>
        item.id === selectedItem.id
          ? { ...item, comment: [...item.comment, newCommentData] }
          : item
      );
  
      setDepartmentTraction(updatedCompanyTraction);
      localStorage.setItem('departmentTractionData', JSON.stringify(updatedCompanyTraction));
      setNewComment('');
      setCommentModalOpen(false);
    }
  };
  

  const handleDeleteComment = (itemId, commentIndex) => {
    setIsEditing(true); // Mark as edited
    const updatedCompanyTraction = { ...departmentTraction };
    updatedCompanyTraction[activeQuarter] = updatedCompanyTraction[activeQuarter].map(item =>
      item.id === itemId
        ? {
            ...item,
            comment: item.comment.filter((_, index) => index !== commentIndex),
          }
        : item
    );
  
    setDepartmentTraction(updatedCompanyTraction);
    localStorage.setItem('departmentTractionData', JSON.stringify(updatedCompanyTraction));
  
    // Also update the selectedItem to reflect the changes in the modal
    const updatedSelectedItem = {
      ...selectedItem,
      comment: selectedItem.comment.filter((_, index) => index !== commentIndex),
    };
    setSelectedItem(updatedSelectedItem);
  };
  
  const handleDeleteRow = (rowId) => {

    setIsEditing(true); // Mark as edited

    // Create a copy of the current department traction data
    const updatedCompanyTraction = { ...departmentTraction };
    
    // Remove the row with the matching rowId from the active quarter
    updatedCompanyTraction[activeQuarter] = updatedCompanyTraction[activeQuarter].filter(item => item.id !== rowId);
    
    // Update the state with the new Department Traction data
    setDepartmentTraction(updatedCompanyTraction);
    
    // Update localStorage to persist changes
    localStorage.setItem('departmentTractionData', JSON.stringify(updatedCompanyTraction));
  };
  

  const openModal = (item) => {
    setSelectedItem(item);
    setCommentModalOpen(true);
  };


  const handleEditChange = (e, rowId, field) => {
    setIsEditing(true); 
    
    const value = e.target.value;
  
    // Update the store
    updateDepartmentTractionField(activeQuarter, rowId, field, value);
  
    // Get latest store data and persist it
    const updatedData = useDepartmentTractionStore.getState().departmentTraction;
    localStorage.setItem('departmentTractionData', JSON.stringify(updatedData));
  };



  const handleProgressChange = (e, rowId) => {
    const value = e.target.value;
  
    // Update the store
    updateDepartmentTractionField(activeQuarter, rowId, 'progress', value);
  
    // Optional: persist to localStorage
    const updatedData = useDepartmentTractionStore.getState().departmentTraction;
    localStorage.setItem('departmentTractionData', JSON.stringify(updatedData));
  
    setIsEditing(true); // Mark as edited
  };

  // Function to determine the color based on progress
  const getProgressColor = (progress) => {
    const value = parseInt(progress);
    if (value < 40) return 'bg-red-500';   // Red for progress < 40%
    if (value >= 40 && value < 95) return 'bg-yellow-500'; // Yellow for 40% to 95%
    return 'bg-green-500'; // Green for progress >= 95%
  };


  const handleDueDateChange = (e, rowId) => {
    const value = e.target.value;
    updateDepartmentTractionField(activeQuarter, rowId, 'dueDate', value);
  
    const updatedData = useDepartmentTractionStore.getState().departmentTraction;
    localStorage.setItem('departmentTractionData', JSON.stringify(updatedData));
  
    setIsEditing(true);
  };
  
  const handleDescriptionChange = (e, rowId) => {
    const value = e.target.value;
    setDescription(value); 
    updateDepartmentTractionField(activeQuarter, rowId, 'description', value);
  
    const updatedData = useDepartmentTractionStore.getState().departmentTraction;
    localStorage.setItem('departmentTractionData', JSON.stringify(updatedData));
  
    setIsEditing(true);
  };
  
  const handleAnnualPriorityChange = (e, rowId) => {
    const value = e.target.value;
    setAnnualPriority(value); 
    updateDepartmentTractionField(activeQuarter, rowId, 'annualPriority', value);
  
    const updatedData = useDepartmentTractionStore.getState().departmentTraction;
    localStorage.setItem('departmentTractionData', JSON.stringify(updatedData));
  
    setIsEditing(true);
  };
  
  const handleRankChange = (e, rowId) => {
    const value = e.target.value;
    setRank(value); 
    updateDepartmentTractionField(activeQuarter, rowId, 'rank', value);
  
    const updatedData = useDepartmentTractionStore.getState().departmentTraction;
    localStorage.setItem('departmentTractionData', JSON.stringify(updatedData));
  
    setIsEditing(true);
  };

  // Function to determine rank color
  const getRankColor = (rank) => {
    switch (rank) {
      case '1':
        return 'bg-green-500 text-white';
      case '2':
        return 'bg-yellow-500 text-white';
      case '3':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };


  const handleSaveChanges = async () => {
    setLoadingSave(true);
  
    setTimeout(async () => {
      setLoadingSave(false);
  
      const savedData = JSON.parse(localStorage.getItem('departmentTractionData'));
  
      ENABLE_CONSOLE_LOGS && console.log('Updated data from localStorage:', savedData);
  
      localStorage.removeItem('departmentTractionData');
      setIsEditing(false); // Hide save/discard buttons
  
      try {
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
  
        const { csrf_token } = await csrfRes.json();
  
        const response = await fetch(`${API_URL}/v1/department-traction/traction-data/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organizationName: organization,
            departmentTractionData: savedData,
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          ENABLE_CONSOLE_LOGS && console.log('✅ Department TractionData Data Updated:', result);
          localStorage.removeItem('departmentTractionData');
        } else {
          console.error('❌ Failed to update department traction data:', result.message);
        }
      } catch (error) {
        console.error('❌ Network error while updating department traction data:', error);
      }
    }, 1000);
  };

  const handleDischargeChanges = () => {
    setLoadingDischarge(true);
    setTimeout(() => {
      setLoadingDischarge(false);
      setShowConfirmModal(true);
      setIsEditing(false); 
    }, 1000);
  };


  const handleAddNewTractionClick = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setAddTractionModalOpen(true);
    }, 1000);
  }

  const confirmDischargeChanges = () => {
    // 1. Remove from localStorage
    localStorage.removeItem('departmentTractionData');

    // 2. Clear edited state (hides buttons)
    setIsEditing(false); 

    // 3. Update Zustand store
    // setDepartmentTraction(initialDepartmentTraction);
    const { baselineDepartmentTraction } = useDepartmentTractionStore.getState();

    // ✅ Console log to inspect baselineDepartmentTraction before setting
    ENABLE_CONSOLE_LOGS &&  console.log('💾 Restoring baselineDepartmentTraction:', baselineDepartmentTraction);

    setDepartmentTraction(baselineDepartmentTraction);

  
    // 4. Hide Modal
    setShowConfirmModal(false);
  };

  

  async function handleAddNewTraction() {
    const mmddyyyy = form.dueDate
      ? `${form.dueDate.split('-')[1]}-${form.dueDate.split('-')[2]}-${form.dueDate.split('-')[0]}`
      : 'Click to set date';
  
    const newItem = {
      id: Date.now(), // Placeholder; real ID from server
      who: form.who,
      collaborator: form.collaborator,
      description: form.description,
      progress: form.progress,
      annualPriority: form.annualPriority,
      dueDate: mmddyyyy,
      rank: form.rank,
      comment: [],
    };
  
    ENABLE_CONSOLE_LOGS && console.log('📤 New Traction Item:', newItem);
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const payload = {
        organizationName: organization,
        quarter: form.quarter,
        newItem,
      };
  
      const response = await fetch(`${API_URL}/v1/department-traction/traction-data/add`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        ENABLE_CONSOLE_LOGS && console.log('✅ Traction item saved to backend:', result.data);
  
        const serverNewItem = result.data;
  
        // Append to local state
        const updated = {
          ...departmentTraction,
          [form.quarter]: [...(departmentTraction[form.quarter] || []), serverNewItem],
        };
  
        addDepartmentTraction(form.quarter, serverNewItem); // Store
        setDepartmentTraction(updated); // UI update
        setAddTractionModalOpen(false); // Close modal
      } else {
        console.error('❌ Failed to save traction item:', result.message || result);
      }
    } catch (err) {
      console.error('❌ Error saving traction item:', err);
    }
  }



  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      
      {/* Employee Filter Centered */}
      <div className="flex justify-center mb-4">
        <div className="text-center">
          <label className="font-medium mr-2">Employee Filter:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">All</option>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quarter Navigation & Actions */}
      <div className="flex justify-between items-center mb-4">
        {/* Quarter Navigation */}
        <div className="flex gap-8">
          {quarters.map((q) => (
            <div
              key={q}
              className={`cursor-pointer text-sm relative pb-2 transition-all duration-200 ${
                activeQuarter === q
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-500 border-b-2 border-transparent'
              }`}
              onClick={() => setActiveQuarter(q)}
            >
              {q}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {isSuperAdmin && (
          <div className="flex gap-2">
            <div className="pure-blue-btn cursor-pointer flex items-center print:hidden" onClick={handleAddNewTractionClick}>
              
              {loading ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPlus} className="mr-1" />
                      Add Department Traction
                    </>
                )}

            </div>
            <div
              className="pure-green-btn cursor-pointer print:hidden"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? 'Hide Completed Rows' : 'Show All Rows'}
            </div>
            <div className="pure-gray-btn cursor-pointer">
              <FontAwesomeIcon icon={faSyncAlt} />
            </div>
          </div>
        )}

      </div>

      {/* Saving & Discharge (Visible only for superadmin) */}
      {isEditing && isSuperAdmin && (
        <div className="flex justify-between items-center mb-4">
          <div className="ml-auto flex space-x-4">
            <div className="pure-green-btn print:hidden" onClick={handleSaveChanges}>

            {loadingSave ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  ) : (
                    "Save Changes"
            )}

              
            </div>
            <div className="pure-red-btn print:hidden" onClick={handleDischargeChanges}>
              {loadingDischarge ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  ) : (
                      'Discard'
              )}

            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {/* Who Dropdown */}
              <th className="border px-4 py-2">
                Who
                {isSuperAdmin && (
                  <select className="block w-full mt-1 text-xs">
                    <option>All</option>
                    {/* Add other options here */}
                  </select>
                )}
              </th>

              {/* Collaborator Dropdown */}
              <th className="border px-4 py-2">
                Collaborator
                {isSuperAdmin && (
                  <select className="block w-full mt-1 text-xs">
                    <option>All</option>
                    {/* Add other options here */}
                  </select>
                )}
              </th>

              {/* Description Column */}
              <th className="border px-4 py-2">Description</th>

              {/* Progress Dropdown */}
              <th className="border px-4 py-2">
                Progress
                {isSuperAdmin && (
                <select className="block w-full mt-1 text-xs">
                  <option>All</option>
                  {/* Add other options here */}
              </select>
                )}
              </th>

              {/* Other static columns */}
              <th className="border px-4 py-2">Annual Priority</th>
              <th className="border px-4 py-2">Due Date</th>
              <th className="border px-4 py-2">Rank</th>
              <th className="border px-4 py-2">Comments</th>
              {isSuperAdmin && <th className="border px-4 py-2 print:hidden">Delete</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <tr key={row.id}>
                  {/* Who Dropdown for each row */}
                  <td className="border px-4 py-2">
                    <select
                      className="w-full text-xs"
                      value={row.who}
                      onChange={(e) => handleEditChange(e, row.id, 'who')}
                      disabled={!isSuperAdmin}
                    >
                      {/* Default: show current selection */}
                      {!users.includes(row.who) && <option value={row.who}>{row.who}</option>}

                      {/* All users from the store */}
                      {users.map((user) => (
                        <option key={user} value={user}>
                          {user}
                        </option>
                      ))}
                    </select>
                  </td>


                  {/* Collaborator Dropdown for each row */}
                  <td className="border px-4 py-2">
                    <select
                      className="w-full text-xs"
                      value={row.collaborator}
                      onChange={(e) => handleEditChange(e, row.id, 'collaborator')}
                      disabled={!isSuperAdmin}
                    >
                      {/* Ensure current collaborator is always shown, even if not in list */}
                      {!users.includes(row.collaborator) && (
                        <option value={row.collaborator}>{row.collaborator}</option>
                      )}

                      {/* List all users from the store */}
                      {users.map((user) => (
                        <option key={user} value={user}>
                          {user}
                        </option>
                      ))}
                    </select>
                  </td>


                  {/* Editable Description Column */}
                  {/* <td className="border px-4 py-2">
                    <input
                      type="text"
                      className="w-full text-xs"
                      value={row.description}
                      onChange={(e) => handleDescriptionChange(e, row.id)}
                      disabled={!isSuperAdmin} // Disable for non-superadmins
                    />
                  </td> */}

                  {/* Editable Description Column */}
                  <td className="border px-4 py-2">
                    <textarea
                       className="w-full text-xs resize-none border border-gray-300" // resize-none to disable manual resizing, optional
                      rows={3}  // number of visible lines
                      value={row.description}
                      onChange={(e) => handleDescriptionChange(e, row.id)}
                      disabled={!isSuperAdmin} // Disable for non-superadmins
                    />
                  </td>


                  <td className="border px-4 py-2">

                  {editingProgress === row.id ? (
                      <select
                        className="w-full text-xs"
                        value={row.progress}
                        onChange={(e) => handleProgressChange(e, row.id)} // Handle change
                        onBlur={() => setEditingProgress(null)} // Hide dropdown when user clicks outside
                        autoFocus
                        disabled={!isSuperAdmin} // Disable for non-superadmins
                      >
                        {/* Create options for progress from 0% to 100% */}
                        {progressOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div
                        onClick={() => setEditingProgress(row.id)} // When clicked, enable editing
                        className={`inline-block px-3 py-1 rounded-full mt-2 text-xs font-medium text-white cursor-pointer ${getProgressColor(
                          row.progress
                        )}`}
                      >
                        {row.progress}
                      </div>
                    )}
                  </td>


                  {/* Editable Annual Priority Column */}
                  {/* <td className="border px-4 py-2">
                    <input
                      type="text"
                      className="w-full text-xs"
                      value={row.annualPriority}
                      onChange={(e) => handleAnnualPriorityChange(e, row.id)}
                      disabled={!isSuperAdmin} // Disable if user is not superadmin
                    />
                  </td> */}

                  {/* Editable Annual Priority Column */}
                  <td className="border px-4 py-2">
                    {isSuperAdmin ? (
                      <select
                        className="w-full text-xs"
                        value={row.annualPriority || ''}
                        onChange={(e) => handleAnnualPriorityChange(e, row.id)}
                      >
                        <option value="">{row.annualPriority || 'Select Annual Priority'}</option>
                        {departmentAnnualPriorities.map((priority) => (
                          <option key={priority.id} value={priority.description}>
                            {priority.description}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs">{row.annualPriority}</span>
                    )}
                  </td>



                  {/* <td className="border px-4 py-2">{row.dueDate}</td> */}
                  <td className="border px-4 py-2">
                    {isSuperAdmin ? (
                      editingCell.rowId === row.id && editingCell.field === 'dueDate' ? (
                        <input
                          type="date"
                          className="w-full text-xs"
                          value={row.dueDate !== 'Click to set date' ? row.dueDate : ''}
                          onChange={(e) => handleDueDateChange(e, row.id)}
                          onBlur={() => setEditingCell({ rowId: null, field: null })}
                          autoFocus
                        />
                      ) : (
                        <div
                          className={`cursor-pointer text-xs ${
                            row.dueDate === 'Click to set date' ? 'text-gray-400 italic' : ''
                          }`}
                          onClick={() => setEditingCell({ rowId: row.id, field: 'dueDate' })}
                        >
                          {row.dueDate}
                        </div>
                      )
                    ) : (
                      <div className="text-xs">{row.dueDate}</div>
                    )}
                  </td>

                  {/* Editable Rank Column with Circle and Conditional Colors */}
                  {/* <td className="border px-4 py-2">
                    <input
                      type="text"
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs text-center ${getRankColor(row.rank)}`}
                      value={row.rank}
                      onChange={(e) => handleRankChange(e, row.id)}
                      disabled={!isSuperAdmin} // Disable if user is not superadmin
                    />
                  </td> */}

                  {/* Editable Rank Column with Circle and Conditional Colors */}
                  <td className="border px-4 py-2">
                    {editingRank === row.id ? (
                      <select
                        className="w-full text-xs"
                        value={row.rank}
                        onChange={(e) => handleRankChange(e, row.id)}
                        onBlur={() => setEditingRank(null)}
                        autoFocus
                        disabled={!isSuperAdmin}
                      >
                        <option value="">Please select</option>
                        <option value=""> </option>
                        <option value="1">1 </option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    ) : (
                      <div
                        onClick={() => isSuperAdmin && setEditingRank(row.id)}
                        className={`inline-block px-4 py-1 rounded-full mt-2 text-xs font-medium text-white cursor-pointer ${getRankColor(row.rank)}`}
                      >
                        {row.rank || '—'}
                      </div>
                    )}
                  </td>

                <td className="border px-4 py-2 text-center">
                  <FontAwesomeIcon
                    icon={faCommentDots}
                    className="text-gray-600 cursor-pointer"
                    onClick={isSuperAdmin ? () => openModal(row) : undefined} // Only open modal if superadmin
                  />
                  {/* Conditionally render the number of comments if they exist */}
                  {row.comment && row.comment.length > 0 && (
                    <label> ({row.comment.length})</label>  // Display the number of comments
                  )}
                </td>
                  {/* 
                  <td className="border px-4 py-2 text-center">
                    <FontAwesomeIcon icon={faTrashAlt} className="text-red-600 cursor-pointer" />
                  </td> */}
                  {isSuperAdmin && (
                    <td className="border px-4 py-2 text-center print:hidden">
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDeleteRow(row.id)}  // Pass the row's ID to handleDeleteRow
                      />
                    </td>
                  )}

                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center p-4 text-gray-500" colSpan="9">
                  No data available for {activeQuarter}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Comment Modal */}
      {commentModalOpen && selectedItem && (
        <div className="transparent-overlay">
          <div className="modal-content">
            <h3 className="text-lg font-semibold mb-4">
              Comments ({selectedItem.comment?.length || 0})
            </h3>

            {/* Render existing comments */}
            {selectedItem.comment?.length > 0 && (
              <div className="comment-list-container">
                {selectedItem.comment.map((comment, index) => (
                  <div key={index} className="vertical-comment">
                    <div className="comment-item">
                      <p className="text-sm">
                        <strong>{comment.author}:</strong> {comment.message}
                      </p>
                      <button
                        onClick={() => handleDeleteComment(selectedItem.id, index)}
                        className="text-red-600 ml-2"
                      >
                        x
                      </button>
                      
                    </div>
                    <div className="nested-comment">
                      <p className="text-gray-500 text-sm">{getTimeAgo(comment.posted)}</p>
                    </div>
                  </div>
                  
                ))}
              </div>
            )}

            {/* Add new comment */}
            <textarea
              className="w-full p-2 border rounded-md"
              placeholder="Enter your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="pure-red-btn"
                onClick={() => setCommentModalOpen(false)} // Close the modal without saving
              >
                Cancel
              </button>
              <button
                className="pure-green-btn"
                onClick={handleAddComment} // Handle adding the comment
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {addTractionModalOpen && (
        <div className="modal-container" onClick={() => setAddTractionModalOpen(false)}>
        {/* <> */}
        
          {/* Overlay */}
          <div
            className="modal-overlay"
            onClick={() => setAddTractionModalOpen(false)}
            style={{
              position: 'fixed',
              zIndex: '49',  // Make sure the overlay is behind the modal
            }}
          />

          {/* Modal */}
          <div className="fixed z-50 inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] relative z-50"
                  onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Add Department Traction</h2>

              <div className="space-y-4 text-sm">
                <div>
                  <label>Annual Priority:</label>
                  <select
                    className="w-full border px-2 py-1 rounded"
                    value={form.annualPriority}
                    onChange={(e) => setForm({ ...form, annualPriority: e.target.value })}
                  >
                    <option value="">Select Annual Priority</option>
                    {departmentAnnualPriorities.map((priority) => (
                      <option key={priority.id} value={priority.description}>
                        {priority.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Quarter:</label>
                  <select
                    className="w-full border px-2 py-1 rounded"
                    value={form.quarter}
                    onChange={(e) => setForm({ ...form, quarter: e.target.value })}
                  >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>

                <div>
                  <label>Who:</label>
                  <select
                    className="w-full border px-2 py-1 rounded"
                    value={form.who}
                    onChange={(e) => setForm({ ...form, who: e.target.value })}
                  >
                    <option value="">Select Who</option>
                    {users.map((user) => (
                      <option key={user} value={user}>{user}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Collaborator:</label>
                    <select
                      className="w-full border px-2 py-1 rounded"
                      value={form.collaborator}
                      onChange={(e) => setForm({ ...form, collaborator: e.target.value })}
                    >
                      <option value="">Select Collaborator</option>
                      {users.map((user) => (
                        <option key={user} value={user}>{user}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Progress:</label>
                    <select
                      className="w-full border px-2 py-1 rounded"
                      value={form.progress}
                      onChange={(e) => setForm({ ...form, progress: e.target.value })}
                    >
                      {[...Array(21).keys()].map(i => (
                        <option key={i * 5} value={`${i * 5}%`}>{i * 5}%</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label>Description:</label>
                  <textarea
                    className="w-full border px-2 py-1 rounded"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Due Date:</label>
                    <input
                      type="date"
                      className="w-full border px-2 py-1 rounded"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label>Rank:</label>
                    <select
                      className="w-full border px-2 py-1 rounded"
                      value={form.rank}
                      onChange={(e) => setForm({ ...form, rank: e.target.value })}
                    >
                      <option value="">Please select</option>
                      <option value=""> </option>
                      <option value="1">1 </option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    className="pure-red2-btn px-4 py-1 rounded"
                    onClick={() => setAddTractionModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    className="pure-blue2-btn px-4 py-1 rounded"
                    onClick={handleAddNewTraction}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/* </> */}
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
              <button className="btn-add" onClick={confirmDischargeChanges}>Yes, Discard</button>
              <button className="btn-close" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Panel */}
      <div className={`activity-log-panel ${showLogs ? 'show' : ''}`}>
        <div className="header">
          <h2>Activity Logs History</h2>
          <button
            className="close-btn"
            onClick={() => setShowLogs(false)}
            aria-label="Close Activity Logs"
          >
            ×
          </button>
        </div>
        <ul>
          {activityLogs.map((log) => (
            <li key={log.id}>
              <strong>{log.author}</strong> {log.message}
              <span>{log.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default DepartmentTractionTable;
