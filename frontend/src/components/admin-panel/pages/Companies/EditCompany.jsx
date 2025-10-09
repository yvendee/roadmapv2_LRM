// frontend/src/components/admin-panel/pages/Companies/EditCompany.jsx

import React, { useState } from 'react';
import './EditCompany.css';
import { useEditCompanyStore } from '../../../../store/admin-panel/companies/editCompanyStore';
import ToastNotification from '../../../../components/toast-notification/ToastNotification';
import API_URL, { ENABLE_CONSOLE_LOGS } from '../../../../configs/config';

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

  const isLoading = !name?.trim();
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Toast state
  const [toast, setToast] = useState({
    message: '',
    status: '',
    isVisible: false,
  });

  // ✅ Toast helpers
  const showToast = (message, status) => {
    setToast({ message, status, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // 🔁 Available months logic
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

  // ✅ Save Changes
  const handleSaveChanges = async () => {
    const organizationName = useEditCompanyStore.getState().name;
    const quarters = useEditCompanyStore.getState().quarters;

    ENABLE_CONSOLE_LOGS && console.log('✅ Save Changes clicked');
    ENABLE_CONSOLE_LOGS && console.log('Company Name:', organizationName);
    ENABLE_CONSOLE_LOGS && console.log('Quarters:', quarters);

    setIsSaving(true);

    try {
      // Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();

      // Send update request
      const res = await fetch(`${API_URL}/v1/admin-panel/quarters/update`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          organizationName,
          quarters,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Failed to update data.');
      }

      ENABLE_CONSOLE_LOGS && console.log('✅ Update successful:', data);
      showToast('Changes saved successfully!', 'success');
    } catch (error) {
      console.error('❌ Save error:', error);
      showToast(`Error saving changes: ${error.message}`, 'error');
    } finally {
      setTimeout(() => setIsSaving(false), 3000);
    }
  };

  return (
    <div className="edit-company-container">
      {/* Name Input */}
      <div className="form-row">
        <div className="form-group">
          <label>
            Name<span className="required">*</span>
          </label>
          {isLoading ? (
            <div className="skeleton h-9 rounded w-full" />
          ) : (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          )}
        </div>
      </div>

      {/* Quarters Section */}
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

              {isLoading ? (
                <div className="skeleton h-10 w-full rounded" />
              ) : (
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
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {isLoading ? (
          <>
            <div className="skeleton h-10 w-40 rounded mr-2" />
            <div className="skeleton h-10 w-32 rounded" />
          </>
        ) : (
          <button
            className="save-btn"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? <div className="spinner"></div> : 'Save Changes'}
          </button>

            // {/* <button className="discard-btn" onClick={handleDiscard}>
            //   Discard
            // </button> */}
            
        )}
      </div>

      {/* ✅ Toast Notification */}
      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        status={toast.status}
      />
    </div>
  );
}
