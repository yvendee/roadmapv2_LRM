import React from 'react';
import './EditCompany.css';
import { useEditCompanyStore } from '../../../../store/admin-panel/companies/editCompanyStore';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function EditCompany() {
  const {
    company,
    setCompanyName,
    handleMonthAdd,
    handleMonthRemove,
    getAvailableMonths,
  } = useEditCompanyStore();

  return (
    <div className="edit-company-container">
      <div className="form-row">
        <div className="form-group">
          <label>
            Name<span className="required">*</span>
          </label>
          <input
            value={company.name}
            onChange={(e) => setCompanyName(e.target.value)}
            className="form-input"
          />
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
                {getAvailableMonths(q).map((month) => (
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
