// frontend\src\components\9.session-dates\1.MonthlySessionTracker\MonthlySessionTracker.jsx
import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';  // npm install @fullcalendar/react @fullcalendar/daygrid
import dayGridPlugin from '@fullcalendar/daygrid';
import './MonthlySessionTracker.css';
import useMonthlySessionTrackerStore from '../../../store/left-lower-content/9.session-dates/1.monthlySessionTrackerStore';
import { parseISO, format } from 'date-fns'  // npm install date-fns

const MonthlySessionTracker = () => {
  const {
    allSessions,
    currentMonth,
    setCurrentMonth,
    getSessionsForMonth,
  } = useMonthlySessionTrackerStore();

  const sessionData = useMemo(() => getSessionsForMonth(currentMonth), [currentMonth, allSessions]);

  const [modalData, setModalData] = useState(null);

  const handleDatesSet = (arg) => {
    setCurrentMonth(arg.view.currentStart);
  };

  const title =
    currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear()
      ? "This Month's Sessions"
      : `${format(currentMonth, 'MMMM yyyy')}'s Sessions`;

  return (
    <div className="monthly-session-container">
      <div className="calendar-container">
        <h5 className="section-title">Monthly Session Calendar</h5>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={allSessions.map((item) => ({
            title: item.status,
            date: item.date,
            className: `session-${item.status.toLowerCase()}`
          }))}
          datesSet={handleDatesSet}
          eventClick={(info) => {
            const clicked = allSessions.find((s) => s.date === info.event.startStr);
            if (clicked) {
              setModalData(clicked); // show modal instead of alert
            }
          }}
          
        />
      </div>

      <div className="table-container">
        <h5 className="section-title">{title}</h5>
        <table className="session-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Meeting Date</th>
            </tr>
          </thead>
          {/* <tbody>
            {sessionData.map((session, idx) => (
              <tr key={idx}>
                <td>{session.status}</td>
                <td>{session.date}</td>
              </tr>
            ))}
          </tbody> */}

        <tbody>
        {sessionData.map((session, idx) => (
            <tr key={idx}>
            <td>
                <span className={`status-label status-${session.status.toLowerCase()}`}>
                {session.status}
                </span>
            </td>
            {/* <td>{format(parseISO(session.date), 'MMMM dd, yyyy')}</td> */}
            <td> {session.date && session.date !== '-' ? format(parseISO(session.date), 'MMMM dd, yyyy') : '-'} </td>

            </tr>
        ))}
        </tbody>


        </table>
      </div>

      {modalData && (
        <div className="modal-overlay " onClick={() => setModalData(null)}>
            <div className="modal-box always-black" onClick={(e) => e.stopPropagation()}>
            <h4>Session Details</h4>
            <p><strong>Date:</strong> {format(parseISO(modalData.date), 'MMMM dd, yyyy')}</p>
            <p><strong>Status:</strong> {modalData.status}</p>
            <p><strong>Details:</strong> {modalData.details}</p>
            <button className="modal-close-btn" onClick={() => setModalData(null)}>Close</button>
            </div>
        </div>
        )}


    </div>

    
  );
};

export default MonthlySessionTracker;
