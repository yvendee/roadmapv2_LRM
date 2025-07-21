import React, { useState, useEffect } from 'react';
import useLoginStore from '../../../store/loginStore';
import './CompanyTraction.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSyncAlt,
  faCommentDots,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

const initialCompanyTraction = {
  Q1: [
    {
      id: 1,
      who: 'Maricar',
      collaborator: 'Maricar',
      description:
        'Develop $8,000 in new monthly revenue - one on one or cohort. Use the references and leads we have.',
      progress: '5%',
      annualPriority: 'Develop lead generation systems',
      dueDate: '03/31/2025',
      rank: '1',
      comment: [],  // Initialize as an empty array for multiple comments
    },
    {
      id: 2,
      who: 'John',
      collaborator: 'Derek',
      description: 'Complete onboarding SOP for sales team',
      progress: '60%',
      annualPriority: 'Streamline internal operations',
      dueDate: '03/25/2025',
      rank: '2',
      comment: [],  // Initialize as an empty array for multiple comments
    },
    {
      id: 3,
      who: 'Arlene',
      collaborator: 'None',
      description: 'Prepare customer success templates',
      progress: '40%',
      annualPriority: 'Improve client retention',
      dueDate: '03/28/2025',
      rank: '3',
      comment: [],  // Initialize as an empty array for multiple comments
    },
  ],
  Q2: [
    {
      id: 1,
      who: 'Maricar',
      collaborator: 'Maricar',
      description:
        'Continue with developing lead generation system but using LinkedIn post and Chuck’s website',
      progress: '0%',
      annualPriority: 'Develop lead generation systems',
      dueDate: 'Click to set date',
      rank: '',
      comment: [],  // Initialize as an empty array for multiple comments
    },
    {
      id: 2,
      who: 'Maricar',
      collaborator: 'None',
      description: 'Use Apollo with Arlene',
      progress: '0%',
      annualPriority: 'Develop lead generation systems',
      dueDate: 'Click to set date',
      rank: '',
      comment: [],  // Initialize as an empty array for multiple comments
    },
    {
      id: 3,
      who: 'Derek',
      collaborator: 'John',
      description: 'Launch Q2 marketing campaign for SaaS clients',
      progress: '10%',
      annualPriority: 'Increase brand awareness',
      dueDate: '05/15/2025',
      rank: '1',
      comment: [],  // Initialize as an empty array for multiple comments
    },
    {
      id: 4,
      who: 'Chuck',
      collaborator: 'Arlene',
      description: 'Evaluate CRM tools and propose migration',
      progress: '25%',
      annualPriority: 'Optimize sales operations',
      dueDate: '06/01/2025',
      rank: '2',
      comment: [],  // Initialize as an empty array for multiple comments
    },
  ],
  Q3: [],
  Q4: [],
};

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const CompanyTraction = () => {

  const loggedUser = useLoginStore((state) => state.user);
  const isSuperAdmin = loggedUser?.role === 'superadmin'; // Check if the user is a superadmin


  const [activeQuarter, setActiveQuarter] = useState('Q2');
  const [showCompleted, setShowCompleted] = useState(true);
  // const [companyTraction] = useState(initialCompanyTraction);
  const [companyTraction, setCompanyTraction, updateComment] = useState(() => {
    // Load company traction from localStorage if available, otherwise use initial data
    const storedData = localStorage.getItem('companyTractionData');
    return storedData ? JSON.parse(storedData) : initialCompanyTraction;
  });

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

  const filteredRows = showCompleted
    ? companyTraction[activeQuarter] || []
    : (companyTraction[activeQuarter] || []).filter((row) => row.progress !== '100%');


  const handleAddComment = () => {
    setIsEditing(true); // Mark as edited
    if (newComment && selectedItem) {
      const updatedCompanyTraction = { ...companyTraction };
      updatedCompanyTraction[activeQuarter] = updatedCompanyTraction[activeQuarter].map(item =>
        item.id === selectedItem.id ? { ...item, comment: [...item.comment, newComment] } : item
      );
      setCompanyTraction(updatedCompanyTraction);
      localStorage.setItem('companyTractionData', JSON.stringify(updatedCompanyTraction));
      setNewComment('');
      setCommentModalOpen(false);
    }
  };

    
  const handleDeleteComment = (itemId, commentIndex) => {
    setIsEditing(true); // Mark as edited
    const updatedCompanyTraction = { ...companyTraction };
    updatedCompanyTraction[activeQuarter] = updatedCompanyTraction[activeQuarter].map(item =>
      item.id === itemId
        ? {
            ...item,
            comment: item.comment.filter((_, index) => index !== commentIndex),
          }
        : item
    );
    setCompanyTraction(updatedCompanyTraction);

    // Also update the selectedItem to reflect the changes in the modal
    const updatedSelectedItem = {
      ...selectedItem,
      comment: selectedItem.comment.filter((_, index) => index !== commentIndex),
    };
    setSelectedItem(updatedSelectedItem);
  };

  const handleDeleteRow = (rowId) => {

    setIsEditing(true); // Mark as edited

    // Create a copy of the current company traction data
    const updatedCompanyTraction = { ...companyTraction };
    
    // Remove the row with the matching rowId from the active quarter
    updatedCompanyTraction[activeQuarter] = updatedCompanyTraction[activeQuarter].filter(item => item.id !== rowId);
    
    // Update the state with the new company traction data
    setCompanyTraction(updatedCompanyTraction);
    
    // Update localStorage to persist changes
    localStorage.setItem('companyTractionData', JSON.stringify(updatedCompanyTraction));
  };
  

  const openModal = (item) => {
    setSelectedItem(item);
    setCommentModalOpen(true);
  };

  const handleEditChange = (e, rowId, field) => {
    const value = e.target.value;
    setCompanyTraction((prev) => {
      const updatedData = { ...prev };
      updatedData[activeQuarter] = updatedData[activeQuarter].map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      );

      // Save updated data to localStorage immediately after modification
      localStorage.setItem('companyTractionData', JSON.stringify(updatedData));

      return updatedData;
    });
  };

  // Function to handle dropdown changes (example with a priority dropdown)
  const handleDropdownChange = (e, rowId, field) => {
    const value = e.target.value;
    setCompanyTraction((prev) => {
      const updatedData = { ...prev };
      updatedData[activeQuarter] = updatedData[activeQuarter].map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      );
      // Save updated data to localStorage immediately after modification
      localStorage.setItem('companyTractionData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  // Function to handle changes in progress dropdown
  const handleProgressChange = (e, rowId) => {
    const value = e.target.value;
    setCompanyTraction((prev) => {
      const updatedData = { ...prev };
      updatedData[activeQuarter] = updatedData[activeQuarter].map((row) =>
        row.id === rowId ? { ...row, progress: value } : row
      );
      // Save updated data to localStorage immediately after modification
      localStorage.setItem('companyTractionData', JSON.stringify(updatedData));
      return updatedData;
    });
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
    handleEditChange(e, rowId, 'dueDate');
  };

  const handleDescriptionChange = (e, rowId) => {
    setIsEditing(true); // Mark as edited
    const value = e.target.value;
    setDescription(value);
    handleEditChange(e, rowId, 'description');
  };

  
  const handleAnnualPriorityChange = (e, rowId) => {
    const value = e.target.value;
    setAnnualPriority(value);
    handleEditChange(e, rowId, 'annualPriority');
    setIsEditing(true); // Mark as edited
  };

  const handleRankChange = (e, rowId) => {
    const value = e.target.value;
    setRank(value);
    handleEditChange(e, rowId, 'rank');
    setIsEditing(true); // Mark as edited
  };

  // Function to determine rank color
  const getRankColor = (rank) => {
    switch (rank) {
      case '1':
        return 'bg-red-500 text-white';
      case '2':
        return 'bg-yellow-500 text-white';
      case '3':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  const handleSaveClick = (rowId) => {
    setEditing((prev) => ({ ...prev, [rowId]: false }));
    handleSaveChanges();
  };

  const handleSaveChanges = () => {
    localStorage.setItem('companyTractionData', JSON.stringify(companyTraction));
    
    // Parse the stored JSON data back to its original object form
    const savedData = JSON.parse(localStorage.getItem('companyTractionData'));
    
    console.log('Updated data from localStorage:', savedData);
    setIsEditing(false); // Hide the buttons after saving
  };

  const handleEditClick = (rowId) => {
    setEditing((prev) => ({ ...prev, [rowId]: true }));
  };


  const handleProgressClick = (rowId, currentProgress) => {
    setEditingProgress(rowId); // Set row id for editing
    setNewProgressValue(currentProgress); // Set current progress as initial value for dropdown
  };

  const handleProgressSave = (rowId) => {
    updateCompanyTractionField(activeQuarter, rowId, 'progress', newProgressValue);
    setEditingProgress(null); // Close dropdown
  };


  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      
      {/* Employee Filter Centered */}
      <div className="flex justify-center mb-4">
        <div className="text-center">
          <label className="font-medium mr-2">Employee Filter:</label>
          <select className="border rounded px-2 py-1 text-sm">
            <option>All</option>
            <option>Maricar</option>
            <option>Arlene</option>
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
            <div className="pure-blue-btn cursor-pointer flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Add Company Traction
            </div>
            <div
              className="pure-green-btn cursor-pointer"
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
            <div className="pure-green-btn" onClick={handleSaveChanges}>
              Save Changes
            </div>
            <div className="pure-red-btn">Discharge Changes</div>
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
              {isSuperAdmin && <th className="border px-4 py-2">Delete</th>}
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
                      disabled={!isSuperAdmin} // Disable for non-superadmins
                    >
                      <option>{row.who}</option>
                      {/* Add other options here */}
                    </select>
                  </td>

                  {/* Collaborator Dropdown for each row */}
                  <td className="border px-4 py-2">
                    <select
                      className="w-full text-xs"
                      value={row.collaborator}
                      onChange={(e) => handleEditChange(e, row.id, 'collaborator')}
                      disabled={!isSuperAdmin} // Disable for non-superadmins
                    >
                      <option>{row.collaborator}</option>
                      {/* Add other options here */}
                    </select>
                  </td>

                  {/* Editable Description Column */}
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      className="w-full text-xs"
                      value={row.description}
                      onChange={(e) => handleDescriptionChange(e, row.id)}
                      disabled={!isSuperAdmin} // Disable for non-superadmins
                    />
                  </td>

                  {/* Progress Dropdown */}
                  <td className="border px-4 py-2">
                    {/* Progress Display with Colored Oblong */}
                    {editingProgress === row.id ? (
                      <select
                        className="w-full text-xs"
                        value={row.progress}
                        onChange={(e) => handleProgressChange(e, row.id)}
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
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      className="w-full text-xs"
                      value={row.annualPriority}
                      onChange={(e) => handleAnnualPriorityChange(e, row.id)}
                      disabled={!isSuperAdmin} // Disable if user is not superadmin
                    />
                  </td>


                  <td className="border px-4 py-2">{row.dueDate}</td>

                  {/* Editable Rank Column with Circle and Conditional Colors */}
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs text-center ${getRankColor(row.rank)}`}
                      value={row.rank}
                      onChange={(e) => handleRankChange(e, row.id)}
                      disabled={!isSuperAdmin} // Disable if user is not superadmin
                    />
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
                    <td className="border px-4 py-2 text-center">
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
                <div key={index} className="comment-item">
                  <span>{comment}</span>
                  <button
                    onClick={() => handleDeleteComment(selectedItem.id, index)}
                  >
                    x
                  </button>
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





    </div>
  );
};

export default CompanyTraction;
