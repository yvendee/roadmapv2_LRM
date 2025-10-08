import React, { useState } from 'react';
import './EditCompany.css';

const allMonths = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December',
];

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function EditCompany() {
  const [company, setCompany] = useState({
    name: 'eDoc Innovations',
    code: 'EDOC008Z',
    quarters: {
      Q1: ['January', 'February'],
      Q2: ['April', 'May', 'June'],
      Q3: ['July', 'August'],
      Q4: ['October', 'November'],
    },
  });

  const getAvailableMonths = () => {
    const selectedMonths = Object.values(company.quarters).flat();
    return allMonths.filter((month) => !selectedMonths.includes(month));
  };

  const handleMonthAdd = (quarter, month) => {
    if (!month) return;
    setCompany((prev) => ({
      ...prev,
      quarters: {
        ...prev.quarters,
        [quarter]: [...prev.quarters[quarter], month],
      },
    }));
  };

  const handleMonthRemove = (quarter, month) => {
    setCompany((prev) => ({
      ...prev,
      quarters: {
        ...prev.quarters,
        [quarter]: prev.quarters[quarter].filter((m) => m !== month),
      },
    }));
  };

  return (
    <div className="edit-company-container">
      <div className="edit-header">
        <h2>Edit Company</h2>
        <button className="delete-btn">Delete</button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            Name<span className="required">*</span>
          </label>
          <input value={company.name} className="form-input" />
        </div>
        <div className="form-group">
          <label>
            Company Code<span className="required">*</span>
          </label>
          <input value={company.code} className="form-input" />
        </div>
      </div>

      <div className="quarters-container">
        <h3>Quarters</h3>

        <div className="quarters-grid">
          {quarters.map((q) => (
            <div key={q} className="quarter-box">
              <div className="quarter-header">{q}</div>

              <div className="selected-months">
                {company.quarters[q].map((month) => (
                  <div key={month} className="month-pill">
                    {month}
                    <span onClick={() => handleMonthRemove(q, month)}>&times;</span>
                  </div>
                ))}
              </div>

              <select
                onChange={(e) => handleMonthAdd(q, e.target.value)}
                value=""
                className="month-dropdown"
              >
                <option value="">Select a month</option>
                {getAvailableMonths().map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
