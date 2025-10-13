import React, { useState } from 'react';
import './QuarterlySessions.css';
import useQuarterlySessionsStore from '../../../store/left-lower-content/9.session-dates/2.quarterlySessionsStore';

const STATUS_OPTIONS = ['Pending', 'Done'];
const getQuarterOptions = () => {
  const year = new Date().getFullYear();
  return [`Q1 ${year}`, `Q2 ${year}`, `Q3 ${year}`, `Q4 ${year}`];
};

const QuarterlySessions = ({ loggedUser }) => {
  const {
    sessions,
    setQuarterlySessions,
    addQuarterlySession,
    updateQuarterlySessionField,
  } = useQuarterlySessionsStore();

  const [editedSessions, setEditedSessions] = useState([...sessions]);

  const handleFieldChange = (index, field, value) => {
    const updated = [...editedSessions];
    updated[index][field] = value;
    setEditedSessions(updated);
  };

  const handleFileUpload = (index, field, file) => {
    const url = URL.createObjectURL(file);
    const updated = [...editedSessions];
    updated[index][field] = {
      name: file.name,
      url: url,
    };
    setEditedSessions(updated);
  };

  const addNewSession = () => {
    const newItem = {
      status: 'Pending',
      quarter: `Q1 ${new Date().getFullYear()}`,
      meetingDate: '',
      agenda: { name: '-', url: '' },
      recap: { name: '-', url: '' },
    };
    setEditedSessions([...editedSessions, newItem]);
  };

  const saveChanges = () => {
    setQuarterlySessions(editedSessions);
  };

  const discardChanges = () => {
    setEditedSessions([...sessions]);
  };

  const renderLink = (file) =>
    file && file.url !== '' ? (
      <a href={file.url} target="_blank" rel="noreferrer">
        {file.name}
      </a>
    ) : (
      '-'
    );

  const isEditable = loggedUser?.role === 'superadmin';

  return (
    <div className="qs-container">
      <h3 className="qs-title always-black">Quarterly Sessions</h3>

      <div style={{ marginBottom: '12px' }}>
        <button onClick={addNewSession}>Add Quarter</button>
        <button onClick={saveChanges} style={{ marginLeft: '8px' }}>
          Save Changes
        </button>
        <button onClick={discardChanges} style={{ marginLeft: '8px' }}>
          Discard
        </button>
      </div>

      <div className="qs-table-wrapper">
        <table className="qs-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Quarter</th>
              <th>Meeting Date</th>
              <th>Agenda</th>
              <th>Post Session Recap</th>
            </tr>
          </thead>
          <tbody>
            {editedSessions.map((session, idx) => (
              <tr key={idx}>
                <td>
                  {isEditable ? (
                    <select
                      value={session.status}
                      onChange={(e) =>
                        handleFieldChange(idx, 'status', e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    session.status
                  )}
                </td>
                <td>
                  {isEditable ? (
                    <select
                      value={session.quarter}
                      onChange={(e) =>
                        handleFieldChange(idx, 'quarter', e.target.value)
                      }
                    >
                      {getQuarterOptions().map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    session.quarter
                  )}
                </td>
                <td>
                  {isEditable ? (
                    <input
                      type="date"
                      value={session.meetingDate}
                      onChange={(e) =>
                        handleFieldChange(idx, 'meetingDate', e.target.value)
                      }
                    />
                  ) : (
                    session.meetingDate
                  )}
                </td>
                <td>
                  {renderLink(session.agenda)}
                  {isEditable && (
                    <input
                      type="file"
                      style={{ marginLeft: '8px' }}
                      onChange={(e) =>
                        handleFileUpload(idx, 'agenda', e.target.files[0])
                      }
                    />
                  )}
                </td>
                <td>
                  {renderLink(session.recap)}
                  {isEditable && (
                    <input
                      type="file"
                      style={{ marginLeft: '8px' }}
                      onChange={(e) =>
                        handleFileUpload(idx, 'recap', e.target.files[0])
                      }
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuarterlySessions;
