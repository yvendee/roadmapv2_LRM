import React from 'react';
import './EditCompany.css';
import { useEditCompanyStore } from '../../../../store/admin-panel/companies/editCompanyStore';

const allMonths = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December',
];

const quartersList = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function EditCompany() {
  const name = useEditCompanyStore((state) => state.name);
  const quarters = useEditCompanyStore((state) => state.quarters);
  const setName = useEditCompanyStore((state) => state.setName);
  const setQuarters = useEditCompanyStore((state) => state.setQuarters);

  const getAvailableMonths = () => {
    const selectedMonths = Object.values(quarters).flat();
    return allMonths.filter((month) => !selectedMonths.includes(month));
  };

  const handleMonthAdd = (quarter, month) => {
    if (!month) return;

    const updated = {
      ...quarters,
      [quarter]: [...quarters[quarter], month],
    };
    setQuarters(updated);
  };

  const handleMonthRemove = (quarter, month) => {
    const updated = {
      ...quarters,
      [quarter]: quarters[quarter].filter((m) => m !== month),
    };
    setQuarters(updated);
  };

  return (
    <div className="edit-company-container">
      <div className="form-row">
        <div className="form-group">
          <label>
            Name<span className="required">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>
        {/* <div className="form-group">
          <label>
            Company Code<span className="required">*</span>
          </label>
          <input value={company.code} className="form-input" />
        </div> */}
      </div>

      <div className="quarters-container">
        <h3>Quarters</h3>

        <div className="quarters-grid">
          {quartersList.map((q) => (
            <div key={q} className="quarter-box">
              <div className="quarter-header">{q}</div>

              <div className="selected-months">
                {quarters[q].map((month) => (
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
