// frontend\src\components\11.coaching-checklist\2.CollapsiblePanels\CollapsiblePanels.jsx
import React, { useState, useEffect } from 'react';
import './CollapsiblePanels.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faCheckSquare,
  faSquare,
  faHandshake,
  faUserTie,
  faBullseye,
  faCheckSquare as faCheckSquareIcon,
  faMoneyBillWave,
  faChartLine,
  faSave,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

import { useOrganizationUIDStore } from '../../../store/layout/organizationUIDStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';


import useAccordionChecklistStore, { initialAccordionChecklist } from '../../../store/left-lower-content/11.coaching-checklist/2.collapsiblePanelsStore';
import useProjectToolsStore from '../../../store/left-lower-content/11.coaching-checklist/1.projectProgressAndToolsStore';


const CollapsiblePanels = () => {
  // const { togglePanel, updateItemField, updateItemStatus } = useAccordionChecklistStore();

  const panels = useAccordionChecklistStore(state => state.panels);
  const updateItemField = useAccordionChecklistStore(state => state.updateItemField);
  const updateItemStatus = useAccordionChecklistStore(state => state.updateItemStatus);
  const togglePanel = useAccordionChecklistStore(state => state.togglePanel);
  const organization = useLayoutSettingsStore((state) => state.organization);


  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedUploadContext, setSelectedUploadContext] = useState(null); // { panelId, itemId }

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);


  const iconMap = {
    faHandshake,
    faUserTie,
    faBullseye,
    faCheckSquare: faCheckSquareIcon,
    faMoneyBillWave,
    faChartLine,
  };

  const updateProgressCounts = () => {
    const panels = useAccordionChecklistStore.getState().panels;
  
    const allItems = panels.flatMap(panel => panel.items);
    const total = allItems.length;
    const completed = allItems.filter(item => item.completed).length;
  
    useProjectToolsStore.getState().setTotalItems(total);
    useProjectToolsStore.getState().setCompletedItems(completed);
  };
  


  const handleUploadClick = (panelId, itemId) => {
    setSelectedUploadContext({ panelId, itemId });
    setUploadError('');
    setUploadModalOpen(true);
  };


  // const handleFileUpload = async () => {
  //   const uid = useOrganizationUIDStore.getState().uid;
  
  //   if (!uploadFile || !selectedUploadContext) return;
  
  //   const { panelId, itemId } = selectedUploadContext;
  //   const panel = panels.find(p => p.id === panelId);
  //   const item = panel.items.find(i => i.id === itemId);
  //   const uploadLink = item.uploadLink;
  
  //   setUploading(true);
  
  //   try {
  //     // 1. Get CSRF Token
  //     const csrfRes = await fetch(`${API_URL}/csrf-token`, {
  //       credentials: 'include',
  //     });
  //     const { csrf_token } = await csrfRes.json();
  
  //     // 2. Upload file
  //     const formData = new FormData();
  //     formData.append('file', uploadFile);
  
  //     const response = await fetch(`${API_URL}${uploadLink}`, {
  //       method: 'POST',
  //       headers: {
  //         'X-CSRF-TOKEN': csrf_token,
  //       },
  //       credentials: 'include',
  //       body: formData,
  //     });
  
  //     if (!response.ok) throw new Error('Upload failed');
  
  //     // Format item.text by replacing spaces with underscores
  //     const formattedText = item.text.replace(/\s+/g, '_');
  
  //     // 3. Generate and store new pdflink
  //     const uploadedFileName = uploadFile.name;
  //     const newPdfLink = `${API_URL}/storage/coaching_checklist/${uid}/${formattedText}${uploadedFileName}`;
  
  //     updateItemField(panelId, itemId, 'pdflink', newPdfLink);
  //     setUploadSuccess(true);
  //     setHasChanges(true);
  //   } catch (err) {
  //     console.error(err);
  //     setUploadError('Upload failed. Try again.');
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  


  const handleFileUpload = async () => {
  
    if (!uploadFile || !selectedUploadContext) return;
  
    const { panelId, itemId } = selectedUploadContext;
    const panel = panels.find(p => p.id === panelId);
    const item = panel.items.find(i => i.id === itemId);
    const uploadLink = item.uploadLink;
  
    // Format text: lowercase, spaces to dashes
    const formattedText = item.text.toLowerCase().replace(/\s+/g, '-');
  
    // Build upload URL
    const uploadPath = `${uploadLink}/${formattedText}`;
    const uploadUrl = `${API_URL}${uploadPath}`;
  
    setUploading(true);
  
    try {
      // 1. Get CSRF Token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      // 2. Upload file
      const formData = new FormData();
      formData.append('file', uploadFile);
  
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: formData,
      });
  
      if (!response.ok) throw new Error('Upload failed');
  
      // 3. Generate file URL
      const uploadedFileName = uploadFile.name;
      const uid = uploadLink.split('/').pop(); // Gets the last segment
      // console.log(uid); // "McW3IcYsbmy1J17iDSnp9"
      const newPdfLink = `${API_URL}/storage/coaching-checklist/${uid}/${formattedText}/${uploadedFileName}`;
  
      updateItemField(panelId, itemId, 'pdflink', newPdfLink);
      setUploadSuccess(true);
      // setHasChanges(true);

      // ✅ Log panel.id, item.id, and item.pdflink
      ENABLE_CONSOLE_LOGS && console.log('📄 Upload Complete:');
      ENABLE_CONSOLE_LOGS && console.log('Panel ID:', panel.id);
      ENABLE_CONSOLE_LOGS && console.log('Item ID:', item.id);
      ENABLE_CONSOLE_LOGS && console.log('PDF Link:', newPdfLink);


      // 🔁 Update backend coaching_checklist_panels record
      try {
        const csrfRes2 = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
        const { csrf_token: csrfToken2 } = await csrfRes2.json();

        const updateRes = await fetch(`${API_URL}/v1/coaching-checklist/update-pdflink`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken2,
          },
          credentials: 'include',
          body: JSON.stringify({
            organization,
            panelId: panel.id,
            itemId: item.id,
            pdflink: newPdfLink,
          }),
        });

        if (!updateRes.ok) throw new Error('Failed to update PDF link in DB');

        const updateJson = await updateRes.json();
        ENABLE_CONSOLE_LOGS && console.log('✅ PDF link updated in DB:', updateJson.message);

      } catch (err) {
        console.error('❌ Error saving PDF link to DB:', err);
      }


    } catch (err) {
      console.error(err);
      setUploadError('Upload failed. Try again.');
    } 
    finally {
      setUploading(false);
    }
  };

  const handleUpdateItemField = (panelId, itemId, field, value) => {
    updateItemField(panelId, itemId, field, value);
    setHasChanges(true);
  };
  
  // const handleUpdateItemStatus = (panelId, itemId, completed) => {
  //   updateItemStatus(panelId, itemId, completed);
  //   setHasChanges(true);
  // };

  const handleUpdateItemStatus = (panelId, itemId, completed) => {
    updateItemStatus(panelId, itemId, completed);
    setHasChanges(true);
    updateProgressCounts(); // ✅ Called on checkbox toggle
  };

  // const handleSaveChanges = () => {
  //   const currentPanels = useAccordionChecklistStore.getState().panels;
  //   console.log('✅ Saving checklist:', currentPanels);
  //   localStorage.removeItem('CoachingChecklistData');
  //   setHasChanges(false);
  // };
  

  const handleSaveChanges = async () => {

    setLoadingSave(true);

    setTimeout(async () => {

      const currentPanels = useAccordionChecklistStore.getState().panels;
  
      try {
        // 1. Get CSRF Token
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
    
        const { csrf_token } = await csrfRes.json();
    
        // 2. Submit updated panels
        const response = await fetch(`${API_URL}/v1/coaching-checklist/panels/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organization,
            panels: currentPanels,
          }),
        });
    
        if (!response.ok) throw new Error('❌ Failed to save checklist');
    
        const result = await response.json();
    
        // 3. Success
        ENABLE_CONSOLE_LOGS && console.log('✅ Coaching checklist saved:', result);
        localStorage.removeItem('CoachingChecklistData');
        setHasChanges(false);

      } catch (err) {
        console.error('❌ Error saving checklist:', err);
      }

      setLoadingSave(false);

  
    }, 1000);

  };


  
  

  // const handleDischarge = () => {
  //   console.log('🗑️ Discarding changes. Reset to initial:', initialAccordionChecklist);
  //   localStorage.removeItem('CoachingChecklistData');
  //   useAccordionChecklistStore.getState().setPanels(initialAccordionChecklist);
  //   setHasChanges(false);
  // };
  

  const handleDischarge = () => {

    setLoadingDischarge(true);

    setTimeout(async () => {

      console.log('🗑️ Discarding changes. Reset to initial but keeping uploadLink and pdflink values.');
  
      const { baselineAccordionChecklist } = useAccordionChecklistStore.getState();
      // ✅ Console log to inspect baselineAccordionChecklist before setting
      ENABLE_CONSOLE_LOGS &&  console.log('💾 Restoring baselineAccordionChecklist:', baselineAccordionChecklist);
  
  
      const currentPanels = useAccordionChecklistStore.getState().panels;
  
      // Create a deep clone of the initial checklist to avoid mutation
      // const resetPanels = initialAccordionChecklist.map(initialPanel => {
      const resetPanels = baselineAccordionChecklist.map(initialPanel => {
        const matchingCurrentPanel = currentPanels.find(p => p.id === initialPanel.id);
    
        const updatedItems = initialPanel.items.map(initialItem => {
          const matchingCurrentItem = matchingCurrentPanel?.items.find(i => i.id === initialItem.id);
    
          return {
            ...initialItem,
            uploadLink: matchingCurrentItem?.uploadLink || '',
            pdflink: matchingCurrentItem?.pdflink || '',
          };
        });
    
        return {
          ...initialPanel,
          items: updatedItems,
        };
      });
    
      localStorage.removeItem('CoachingChecklistData');
      useAccordionChecklistStore.getState().setPanels(resetPanels);
      setHasChanges(false);

  
      setLoadingDischarge(false);
    }, 1000);
    
  };

  
  useEffect(() => {
    if (hasChanges) {
      localStorage.setItem('CoachingChecklistData', JSON.stringify(panels));
    }
  }, [hasChanges, panels]);
  

  useEffect(() => {
    const savedData = localStorage.getItem('CoachingChecklistData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      useAccordionChecklistStore.getState().setPanels(parsed);
      setHasChanges(true); // Show action buttons if restored
    }
    updateProgressCounts(); // ✅ Called on checkbox toggle
  }, []);
  

  return (
    <div className="accordion-container">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Coaching Checklist</h2>
        {hasChanges && (
          <div className="flex gap-3">
            <button className="pure-blue-btn" onClick={handleSaveChanges}>
              {/* Saving changes */}
              {loadingSave ? (
                  <div className="loader-bars-collapsible">
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
            <button className="pure-red-btn" onClick={handleDischarge}>
              {/* Discard */}
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
          </div>
        )}
      </div>

      <div className="accordion-container">
        {panels.map((panel) => {
          const mappedIcon = iconMap[panel.icon] || faCheckSquare;

          return (
            <div key={panel.id} className="accordion-panel">
              <div className="accordion-header" onClick={() => togglePanel(panel.id)}>
                <div className="accordion-left always-black">
                  <FontAwesomeIcon icon={mappedIcon} className="accordion-icon" />
                  <span>{panel.title}</span>
                </div>
                <FontAwesomeIcon
                  icon={panel.expanded ? faChevronUp : faChevronDown}
                  className="accordion-chevron"
                />
              </div>

              {panel.expanded && (
                <div className="accordion-content always-black">
                  <ul>
                    {panel.items.map((item) => (
                      <li key={item.id} className="accordion-item py-3 border-b border-gray-300">

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          
                          {/* Left section: Checkbox + Text */}
                          <div className="flex items-center gap-2 w-64 shrink-0">
                            <FontAwesomeIcon
                              icon={item.completed ? faCheckSquare : faSquare}
                              className="item-checkbox cursor-pointer"
                              // onClick={() => updateItemStatus(panel.id, item.id, !item.completed)}
                              onClick={() => handleUpdateItemStatus(panel.id, item.id, !item.completed)}
                            />
                            <span className={`font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                              {item.text}
                            </span>
                          </div>

                          {/* Right section: Date, Link, Buttons */}
                          {/* <div className="grid grid-cols-[150px_300px_auto_auto] gap-4 items-center w-full"> */}
                          <div className="grid grid-cols-[150px_300px_1fr] gap-4 items-center w-full">

                            {/* Date field */}
                            <input
                              type="date"
                              value={item.date ? item.date : ''}
                              onChange={(e) => handleUpdateItemField(panel.id, item.id, 'date', e.target.value)}
                              className="px-2 py-1 border rounded w-full"
                            />

                            {/* Link input */}
                            <input
                              type="text"
                              value={item.link || ''}
                              onChange={(e) => handleUpdateItemField(panel.id, item.id, 'link', e.target.value)}
                              className="px-2 py-1 border rounded w-full"
                              placeholder="Insert link"
                            />

                            {/* Buttons: Upload | View | View Document */}
                            <div className="flex gap-2">

                              {/* View button */}
                              <button
                                className={`${
                                  !item.link || item.link === '-' ? 'pure-gray-btn cursor-not-allowed' : 'pure-green-btn'
                                }`}
                                onClick={() => {
                                  if (item.link && item.link !== '-') {
                                    window.open(item.link, '_blank');
                                  }
                                }}
                                disabled={!item.link || item.link === '-'}
                              >
                                View
                              </button>

                              {/* Upload button */}
                              <button
                                className="pure-blue-btn"
                                onClick={() => handleUploadClick(panel.id, item.id)}
                              >
                                Upload
                              </button>

                              {/* View Document button */}
                              <button
                                className={`${
                                  !item.pdflink || item.pdflink === '-' ? 'pure-gray-btn cursor-not-allowed' : 'pure-lime-btn'
                                }`}
                                onClick={() => {
                                  if (item.pdflink && item.pdflink !== '-') {
                                    window.open(item.pdflink, '_blank');
                                  }
                                }}
                                disabled={!item.pdflink || item.pdflink === '-'}
                              >
                                View Document
                              </button>
                            </div>
                          </div>

                        </div>
                      </li>

                    ))}
                  </ul>
                </div>
              )}


            </div>
          );
        })}
      </div>


      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="modal-add-overlay">
          <div className="modal-add-box">
            <div className="modal-add-title">Upload File</div>

            {uploadSuccess ? (
              <div className="text-green-600 text-center mb-4">Upload successful!</div>
            ) : (
              <>
                <label className="modal-add-label">Choose File</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const allowedTypes = [
                      'application/pdf',
                      'application/msword',
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      'application/vnd.ms-excel',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    ];

                    if (!allowedTypes.includes(file.type)) {
                      setUploadError('Only PDF, Word, or Excel files are allowed.');
                      setUploadFile(null);
                      return;
                    }

                    if (file.size > 10 * 1024 * 1024) {
                      setUploadError('File must be less than 10MB.');
                      setUploadFile(null);
                      return;
                    }

                    setUploadError('');
                    setUploadFile(file);
                  }}
                  className="modal-add-input"
                />

                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
              </>
            )}

            {uploading && (
              <div className="loader-bars mt-4">
                <div></div><div></div><div></div>
              </div>
            )}

            <div className="modal-add-buttons">
              {uploadSuccess ? (
                <button
                  className="btn-add"
                  onClick={() => {
                    setUploadModalOpen(false);
                    setUploadFile(null);
                    setUploadSuccess(false);
                    setSelectedUploadContext(null);
                  }}
                >
                  OK
                </button>
              ) : (
                <>
                  <button
                    className="btn-close"
                    onClick={() => {
                      setUploadModalOpen(false);
                      setUploadFile(null);
                      setUploadError('');
                      setUploadSuccess(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="btn-add" onClick={handleFileUpload} disabled={uploading}>
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

export default CollapsiblePanels;
