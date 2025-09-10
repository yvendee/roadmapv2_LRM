// frontend\src\components\11.coaching-checklist\2.CollapsiblePanels\CollapsiblePanels.jsx
import React, { useState } from 'react';
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
} from '@fortawesome/free-solid-svg-icons';

import useAccordionChecklistStore from '../../../store/left-lower-content/11.coaching-checklist/2.collapsiblePanelsStore';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CollapsiblePanels = () => {
  // const { togglePanel, updateItemField, updateItemStatus } = useAccordionChecklistStore();

  const { togglePanel } = useAccordionChecklistStore();
  const panels = useAccordionChecklistStore(state => state.panels);
  const updateItemField = useAccordionChecklistStore(state => state.updateItemField);
  const updateItemStatus = useAccordionChecklistStore(state => state.updateItemStatus);




  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedUploadContext, setSelectedUploadContext] = useState(null); // { panelId, itemId }


  const iconMap = {
    faHandshake,
    faUserTie,
    faBullseye,
    faCheckSquare: faCheckSquareIcon,
    faMoneyBillWave,
    faChartLine,
  };

  const handleUploadClick = (panelId, itemId) => {
    setSelectedUploadContext({ panelId, itemId });
    setUploadError('');
    setUploadModalOpen(true);
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !selectedUploadContext) return;

    const { panelId, itemId } = selectedUploadContext;
    const panel = panels.find(p => p.id === panelId);
    const item = panel.items.find(i => i.id === itemId);
    const uploadLink = item.uploadLink;

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

      const response = await fetch(`${API_URL}${uploadLink}`, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      // 3. Generate and store new pdflink
      const uploadedFileName = uploadFile.name;
      const uploadPath = uploadLink.replace('/file-upload/', '');
      const newPdfLink = `${API_URL}/storage/${uploadPath}/${uploadedFileName}`;

      updateItemField(panelId, itemId, 'pdflink', newPdfLink);
      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      setUploadError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = () => {
    // logic to save panels or send to API
  };
  
  const handleDischarge = () => {
    // logic to reset/discharge items
  };

  return (
    <div className="accordion-container">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Coaching Checklist</h2>
        <div className="flex gap-3">
          <button className="pure-blue-btn">
            Saving changes
          </button>
          <button className="pure-red-btn">
            Discharge
          </button>
        </div>
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
                              onClick={() => updateItemStatus(panel.id, item.id, !item.completed)}
                            />
                            <span className={`font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                              {item.text}
                            </span>
                          </div>

                          {/* Right section: Date, Link, Buttons */}
                          <div className="grid grid-cols-[150px_300px_auto_auto] gap-4 items-center w-full">
                            {/* Date field */}
                            <input
                              type="date"
                              value={item.date ? new Date(item.date).toISOString().slice(0, 10) : ''}
                              onChange={(e) => updateItemField(panel.id, item.id, 'date', e.target.value)}
                              className="px-2 py-1 border rounded w-full"
                            />

                            {/* Link input */}
                            <input
                              type="text"
                              value={item.link || ''}
                              onChange={(e) =>
                                updateItemField(panel.id, item.id, 'link', e.target.value)
                              }
                              className="px-2 py-1 border rounded w-full"
                              placeholder="Insert link"
                            />

                            {/* Upload button */}
                            <button
                              className="pure-blue-btn w-full"
                              onClick={() => handleUploadClick(panel.id, item.id)}
                            >
                              Upload
                            </button>

                            {/* View button */}
                            <button
                              className={`pure-green-btn w-full ${
                                !item.pdflink || item.pdflink === '-' ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={() => {
                                if (item.pdflink && item.pdflink !== '-') {
                                  window.open(item.pdflink, '_blank');
                                }
                              }}
                              disabled={!item.pdflink || item.pdflink === '-'}
                            >
                              View
                            </button>
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
