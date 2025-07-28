// frontend/src/components/9.session-dates/3.MonthlySessions/MonthlySessions.jsx
import React from 'react';
import './MonthlySessions.css';
import useMonthlySessionsStore from '../../../store/left-lower-content/9.session-dates/3.monthlySessionsStore';

const MonthlySessions = () => {
  const { monthlySessions } = useMonthlySessionsStore();

  // Check if a row is a skeleton row
  const isSkeleton = (session) =>
    session.status === '-' &&
    session.month === '-' &&
    session.date === '-' &&
    session.agenda === '-' &&
    session.recap === '-';

  // Reusable skeleton cell
  const renderCell = (value, width = 'w-24') =>
    value === '-' ? <div className={`skeleton ${width}`}></div> : value;

  return (
    <div className="monthly-sessions-container">
      <h5 className="section-title">Monthly Sessions</h5>
      <table className="monthly-sessions-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Month</th>
            <th>Meeting Date</th>
            <th>Agenda</th>
            <th>Post Session Recap</th>
          </tr>
        </thead>
        <tbody>
          {monthlySessions.map((session, idx) => (
            <tr key={idx}>
              <td>{renderCell(session.status, 'w-16')}</td>
              <td>{renderCell(session.month, 'w-20')}</td>
              <td>{renderCell(session.date, 'w-28')}</td>
              <td>{renderCell(session.agenda, 'w-40')}</td>
              <td>{renderCell(session.recap, 'w-40')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlySessions;
