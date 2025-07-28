// frontend/src/components/9.session-dates/2.QuarterlySessions/QuarterlySessions.jsx
import React from 'react';
import './QuarterlySessions.css';
import useQuarterlySessionsStore from '../../../store/left-lower-content/9.session-dates/2.quarterlySessionsStore';

const QuarterlySessions = () => {
  const { sessions } = useQuarterlySessionsStore();

  const isSkeleton = (session) =>
    session.status === '-' &&
    session.quarter === '-' &&
    session.meetingDate === '-' &&
    session.agenda === '-' &&
    session.recap === '-';

  const renderCell = (content, width = 'w-24') =>
    content === '-' ? <div className={`skeleton ${width}`}></div> : content;

  return (
    <div className="qs-container">
      <h3 className="qs-title">Quarterly Sessions</h3>
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
            {sessions.map((session, idx) => (
              <tr key={idx}>
                <td>{renderCell(session.status, 'w-16')}</td>
                <td>{renderCell(session.quarter, 'w-20')}</td>
                <td>{renderCell(session.meetingDate, 'w-32')}</td>
                <td>{renderCell(session.agenda, 'w-40')}</td>
                <td>{renderCell(session.recap, 'w-40')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuarterlySessions;
